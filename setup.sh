#!/bin/bash
#Description: Setup script to install the EmonMUC framework
GIT_SERVER="https://github.com/emoncms"
GIT_BRANCH="stable"

# Set the targeted location of the emonmuc framework and the emoncms webserver.
# If a specified directory is empty, the component will be installed.
EMONMUC_DIR="/opt/emonmuc"
EMONMUC_USER="pi"
EMONMUC_PORT=8080

EMONCMS_DIR="/var/www/html"
EMONCMS_USER="www-data"


if [[ $EUID -ne 0 ]]; then
  echo "Please make sure to run the emonmuc setup as root EMONMUC_USER"
  exit 1
fi

if type -p java >/dev/null 2>&1; then
  JAVA_CMD=java
elif [[ -n "$JAVA_HOME" ]] && [[ -x "$JAVA_HOME/bin/java" ]]; then
  JAVA_CMD="$JAVA_HOME/bin/java"
else
  apt-get install -y -qq openjdk-8-jre-headless
fi

if [[ "$JAVA_CMD" ]]; then
  JAVA_VERS=$("$JAVA_CMD" -version 2>&1 | awk -F '"' '/version/ {print $2}')
  if [[ "$JAVA_VERS" < "1.8" ]]; then
    echo "Installed java version is below 1.8 and not compatible with emonmuc"
    exit 1
  fi
fi

find_emonmuc_dir() {
  # Attempt to set EMONMUC_DIR
  # Resolve links: $0 may be a link
  PRG="$0"
  # Need this for relative symlinks.
  while [ -h "$PRG" ] ; do
    ls=`ls -ld "$PRG"`
    link=`expr "$ls" : '.*-> \(.*\)$'`
    if expr "$link" : '/.*' > /dev/null; then
      PRG="$link"
    else
      PRG=`dirname "$PRG"`"/$link"
    fi
  done
  SAVED="`pwd`"
  cd "`dirname \"$PRG\"`/.." >/dev/null
  EMONMUC_DIR="`pwd -P`"
  cd "$SAVED" >/dev/null
}

download_emonmuc() {
  echo "Downloading emonmuc framework"
  apt-get install -y -qq git-core

  git clone -b $GIT_BRANCH "https://github.com/isc-konstanz/emonmuc.git" $EMONMUC_DIR
  chown $EMONMUC_USER:root -R $EMONMUC_DIR
}

install emonmuc() {
  echo "Installing emonmuc framework"

  apt-get install -y -qq unzip nc

  mkdir -p /var/{lib,run}/emonmuc /var/log/emoncms
  chown $EMONMUC_USER /var/{lib,run}/emonmuc /var/log/emoncms
  chown $EMONCMS_USER -R $EMONMUC_DIR/web

  sudo -u $EMONCMS_USER ln -sf $EMONMUC_DIR/web/Modules/channel $EMONCMS_DIR/Modules/
  sudo -u $EMONCMS_USER ln -sf $EMONMUC_DIR/web/Modules/muc $EMONCMS_DIR/Modules/
  sudo -u $EMONCMS_USER ln -sf $EMONMUC_DIR/web/Theme/seal $EMONCMS_DIR/Theme/

  ln -sf $EMONMUC_DIR/bin/emonmuc /usr/local/bin/emonmuc
  ln -sf $EMONMUC_DIR/lib/systemd/emonmuc.service /lib/systemd/system/emonmuc.service
  echo "d /var/run/emonmuc 0755 $EMONMUC_USER root -" | sudo tee /usr/lib/tmpfiles.d/emonmuc.conf  >/dev/null 2>&1

  systemctl enable emonmuc.service
  systemctl start emonmuc.service
  while ! nc -z localhost $EMONMUC_PORT; do
    sleep 0.1
  done

  source $EMONMUC_DIR/lib/framework/bundles.sh
  install_framework

  php $EMONMUC_DIR/setup.php --dir $EMONCMS_DIR --apikey $API_KEY
  chown $EMONMUC_USER -R $EMONMUC_DIR/conf

  systemctl restart emonmuc.service
}

install_emoncms() {
  echo "Installing emoncms webserver"
  apt-get install -y -qq apache2 php7.0 libapache2-mod-php7.0 php7.0-mysql php7.0-gd php7.0-opcache php7.0-curl php7.0-dev php7.0-mcrypt php7.0-common php-pear php-redis

  a2enmod rewrite
  pear channel-discover pear.swiftmailer.org
  pecl channel-update pecl.php.net
  pecl install swift/swift

  mkdir -p $EMONCMS_DIR /var/log/emoncms /var/lib/emoncms/{phpfiwa,phpfina,phptimeseries}
  touch /var/log/emoncms/emoncms.log
  chmod 666 /var/log/emoncms/emoncms.log
  chown $EMONCMS_USER:root /var/log/emoncms/emoncms.log
  chown $EMONCMS_USER:root -R $EMONCMS_DIR /var/lib/emoncms

  sudo -u $EMONCMS_USER git clone -b $GIT_BRANCH $GIT_SERVER/emoncms.git $EMONCMS_DIR/emoncms
  sudo -u $EMONCMS_USER git clone -b master $GIT_SERVER/device.git $EMONCMS_DIR/emoncms/Modules/device
  sudo -u $EMONCMS_USER git clone -b $GIT_BRANCH $GIT_SERVER/graph.git $EMONCMS_DIR/emoncms/Modules/graph
  #sudo -u $EMONCMS_USER git clone -b $GIT_BRANCH $GIT_SERVER/app.git $EMONCMS_DIR/emoncms/Modules/app
  if [ "$EMONCMS_DIR" != "/var/www/html" ]; then
    sudo -u $EMONCMS_USER ln -sf $EMONCMS_DIR/emoncms /var/www/html/emoncms
  fi
  cp $EMONMUC_DIR/conf/emoncms.apache2.conf /etc/apache2/sites-available/emoncms.conf
  a2ensite emoncms
  systemctl reload apache2

  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq pwgen mariadb-server mariadb-client redis-server

  SQL_ROOT=$(pwgen -s1 32)
  #SQL_ROOT=$(echo "$SQL_ROOT" | tr \\\´\`\'\"\$\@\( $(pwgen -1 1))

  SQL_EMONMUC_USER=$(pwgen -s1 32)
  #SQL_EMONMUC_USER=$(echo "$SQL_EMONMUC_USER" | tr \\\´\`\'\"\$\@\( $(pwgen -1 1))

  mysql -uroot --execute="SET PASSWORD FOR 'root'@'localhost' = PASSWORD('$SQL_ROOT');\
CREATE DATABASE emoncms DEFAULT CHARACTER SET utf8;\
CREATE EMONMUC_USER 'emoncms'@'localhost' IDENTIFIED BY '$SQL_EMONMUC_USER';\
GRANT ALL ON emoncms.* TO 'emoncms'@'localhost';\
FLUSH PRIVILEGES;"

  sudo -u $EMONCMS_USER cp $EMONMUC_DIR/conf/emoncms.default.php $EMONCMS_DIR/emoncms/settings.php
  sed -i "7s/<password>/$SQL_EMONMUC_USER/" $EMONCMS_DIR/emoncms/settings.php
  php -f $EMONMUC_DIR/lib/emoncms/upgrade.php

  echo "[MySQL]" > $EMONMUC_DIR/setup_pwd.conf
  echo "root:$SQL_ROOT" >> $EMONMUC_DIR/setup_pwd.conf
  echo "emoncms:$SQL_EMONMUC_USER" >> $EMONMUC_DIR/setup_pwd.conf
}

API_KEY=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    -d | --dir)
      EMONCMS_DIR="$2"
      shift
      shift
      ;;
    -a | --apikey)
      API_KEY="$2"
      shift
      shift
      ;;
    *)
      echo "Synopsis: setup.sh [-d|--dir directory] [-a|--apikey apikey]"
      exit 1
      ;;
  esac
done

if [ -z ${EMONMUC_DIR+x} ]; then
  find_emonmuc_dir

elif [ ! -d "$EMONMUC_DIR" ]; then
  download_emonmuc
fi
#echo -e "\e[96m\e[1m$(cat $EMONMUC_DIR/lib/framework/welcome.txt)\e[0m"

if [ ! -d "$EMONCMS_DIR/emoncms" ]; then
  install_emoncms
fi
install_emonmuc

echo "Successfully installed the emonmuc framework"

exit 0