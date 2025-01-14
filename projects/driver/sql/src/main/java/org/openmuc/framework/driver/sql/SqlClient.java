/*
 * Copyright 2011-2021 Fraunhofer ISE
 *
 * This file is part of OpenMUC.
 * For more information visit http://www.openmuc.org
 *
 * OpenMUC is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * OpenMUC is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OpenMUC.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
package org.openmuc.framework.driver.sql;

import static org.openmuc.framework.config.option.annotation.OptionType.ADDRESS;
import static org.openmuc.framework.config.option.annotation.OptionType.SETTING;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.openmuc.framework.config.ArgumentSyntaxException;
import org.openmuc.framework.config.Settings;
import org.openmuc.framework.config.option.annotation.Option;
import org.openmuc.framework.config.option.annotation.Syntax;
import org.openmuc.framework.driver.DriverChannelScannerFactory;
import org.openmuc.framework.driver.DriverDevice;
import org.openmuc.framework.driver.annotation.Configure;
import org.openmuc.framework.driver.annotation.Connect;
import org.openmuc.framework.driver.annotation.Device;
import org.openmuc.framework.driver.annotation.Disconnect;
import org.openmuc.framework.driver.annotation.Read;
import org.openmuc.framework.driver.annotation.Write;
import org.openmuc.framework.driver.spi.ConnectionException;
import org.openmuc.framework.driver.sql.table.ColumnScanner;
import org.openmuc.framework.driver.sql.table.TimestampTable;
import org.openmuc.framework.driver.sql.table.UnionTable;
import org.openmuc.framework.driver.sql.time.TimestampIndex;
import org.openmuc.framework.driver.sql.time.TimestampSplit;
import org.openmuc.framework.driver.sql.time.TimestampUnix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.mchange.v2.c3p0.ComboPooledDataSource;

@Syntax(separator = ";", assignment = "=", keyValuePairs = { ADDRESS, SETTING })
@Device(channel = SqlChannel.class)
public class SqlClient extends DriverDevice implements DriverChannelScannerFactory {
    private static final Logger logger = LoggerFactory.getLogger(SqlClient.class);

    protected String url;

    @Option(type = ADDRESS,
            name = "Host name",
            description = "The host name of the SQL server to connect to.<br><br>" +
                          "<b>Example:</b>" +
                          "<ol>" +
                              "<li>localhost</li>" +
                              "<li>127.0.0.1</li>" +
                              "<li>192.168.178.88</li>" +
                          "</ol>")
    protected String host;

    @Option(id = "port",
            name = "Port",
            description = "The port of the SQL server to connect to.",
            valueDefault = "3306",
            mandatory = false)
    protected int port = 3306;

    @Option(id = "database",
            name = "Database name",
            description = "Name of the database to connect to.")
    protected String database;

    @Option(id = "table",
            name = "Table name",
            description = "Tablename to read columns from.",
            mandatory = false)
    protected String table;

    private final List<String> tables = new ArrayList<String>();

    @Option(type = SETTING,
            name = "Table union",
            description = "Enable the union of all found tables in the database, before queries.",
            valueDefault = "false",
            mandatory = false)
    protected boolean union = false;

    @Option(type = SETTING,
            name = "Database driver",
            mandatory = false)
    protected String driver = SqlDriver.DB_DRIVER;

    @Option(type = SETTING,
            name = "Database type",
            mandatory = false)
    protected String type = SqlDriver.DB_TYPE;

    @Option(type = SETTING,
            name = "Username",
            description = "Username to authorize the connection to the database.",
            mandatory = false)
    protected String user = SqlDriver.DB_USER;

    @Option(type = SETTING,
            name = "Password",
            description = "Password to authenticate the connection to the database.",
            mandatory = false)
    protected String password = SqlDriver.DB_PWD;

    @Option(type = SETTING,
            name = "Time resolution",
            description = "The time resolution of stored time series.",
            valueSelection = "1:Milliseconds,1000:Seconds,60000:Minutes,3600000:Hours",
            valueDefault = "1000",
            mandatory = false)
    protected int timeResolution = 1000;

    @Option(type = SETTING,
            name = "Time format",
            description = "The format of the stored time index.",
            valueDefault = "yyyy-MM-dd HH:mm:ss",
            mandatory = false)
    protected String timeFormat = "yyyy-MM-dd HH:mm:ss";

    @Option(type = SETTING,
            name = "Index type",
            description = "The type of the index.",
            valueSelection = "TIMESTAMP:Timestamp,TIMESTAMP_UNIX:Unix timestamp,TIMESTAMP_SPLIT:Split timestamp.",
            valueDefault = "TIMESTAMP_UNIX",
            mandatory = false
    )
    protected IndexType indexType = IndexType.TIMESTAMP_UNIX;

    @Option(type = SETTING,
            name = "Index column",
            description = "The column name of the table primary key.",
            valueDefault = "time",
            mandatory = false)
    protected String indexColumn = "time";

    protected Index index;

    private ComboPooledDataSource source = null;

    public String getDatabase() {
        return url;
    }

    public String getDatabaseName() {
        return database;
    }

    public String getDatabaseDriver() {
        return driver;
    }

    public String getDatabaseType() {
        return type;
    }

    public String getDatabaseUser() {
        return user;
    }

    public String getDatabasePassword() {
        return password;
    }

    public String getTable() {
        return table;
    }

    public boolean isUnion() {
        return union;
    }

    public int getTimeResolution() {
        return timeResolution;
    }

    public String getTimeFormat() {
        return timeFormat;
    }

    public IndexType getIndexType() {
        return indexType;
    }

    public String getIndexColumn() {
        return indexColumn;
    }

    public Index getIndex() {
        return index;
    }

    @Override
    public ColumnScanner newScanner(Settings settings) {
        return new ColumnScanner(source, type + "://" + host + ":" + port + "/" + database);
    }

    @Configure
    protected void configure() throws ArgumentSyntaxException {
        if (database == null || database.isEmpty()) {
            throw new ArgumentSyntaxException("Database name needs to be configured");
        }
        url = type + "://" + host + ":" + port + "/" + database + "?autoReconnect=true&useSSL=false";
        
        if (user == null || user.isEmpty() || password == null || password.isEmpty()) {
            throw new ArgumentSyntaxException("Database login credentials need to be configured");
        }
        
        if (table != null) {
            String valid = table.replaceAll("[^a-zA-Z0-9]", "_");
            if (!table.equals(valid)) {
                throw new ArgumentSyntaxException(
                        "Table name invalid. Only alphanumeric letters separated by underscore are allowed: " + valid);
            }
        }
        
        switch(indexType) {
        case TIMESTAMP:
            index = new TimestampIndex(indexColumn, timeFormat);
            break;
        case TIMESTAMP_SPLIT:
            index = new TimestampSplit(indexColumn, timeFormat);
            break;
        default:
            index = new TimestampUnix(indexColumn, timeResolution);
            break;
        }
    }

    @Connect
    protected void connect() throws ArgumentSyntaxException, ConnectionException {
        logger.info("Initializing SQL connection \"{}\"", url);
        try {
            if (source != null) {
                source.close();
            }
            source = new ComboPooledDataSource();
            source.setDriverClass(driver);
            source.setJdbcUrl(url);
            source.setUser(user);
            source.setPassword(password);
            
            readTables();

        } catch (Exception e) {
            throw new ConnectionException(e);
        }
    }

    @Disconnect
    public void close() {
        source.close();
        source = null;
    }

    @Read
    public void read(List<SqlChannel> channels, String samplingGroup) throws  ConnectionException {
        try (Connection connection = source.getConnection()) {
            if (union) {
                readTables();
                readUnion(channels, connection);
            }
            else {
                read(channels, connection);
            }
        } catch (SQLException e) {
            throw new ConnectionException(e);
        }
    }

    private void read(List<SqlChannel> channels, Connection connection) throws SQLException {
        for (SqlTable table : groupChannels(channels)) {
            table.read(connection);
        }
    }

    private void readUnion(List<SqlChannel> channels, Connection connection) throws SQLException {
        UnionTable union = new UnionTable(this.tables, index);
        union.channels.addAll(channels);
        union.read(connection);
    }

    private void readTables() throws ConnectionException {
        tables.clear();
        
        try (Connection connection = source.getConnection()) {
            try (Statement statement = connection.createStatement()) {
                try (ResultSet result = statement.executeQuery(String.format("SHOW tables FROM %s", database))) {
                    while (result.next()) {
                        tables.add(result.getString("tables_in_" + database));
                    }
                }
            }
        } catch (SQLException e) {
            throw new ConnectionException(e);
        }
        logger.debug("Read tables for database {}: {}", database, String.join(", ", tables));
    }

    protected Collection<SqlTable> groupChannels(List<SqlChannel> channels) {
        Map<String, SqlTable> tables = new HashMap<String, SqlTable>();
        for (SqlChannel channel : channels) {
            String tableName = channel.getTable();
            SqlTable table = tables.get(channel.getTable());
            if (table == null) {
                table = new TimestampTable(tableName, index);
                tables.put(tableName, table);
            }
            table.channels.add(channel);
        }
        return tables.values();
    }

    @Write
    public void write(List<SqlChannel> channels) throws ConnectionException {
        try (Connection connection = source.getConnection()) {
            try (Transaction transaction = new Transaction(connection)) {
                for (SqlTable table : groupChannels(channels)) {
                    table.write(transaction);
                }
            }
        } catch (Exception e) {
            throw new ConnectionException(e);
        }
    }

}
