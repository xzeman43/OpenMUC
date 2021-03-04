package org.openmuc.framework.driver;

import org.openmuc.framework.config.ArgumentSyntaxException;
import org.openmuc.framework.config.Settings;

public interface ChannelScannerFactory {

    ChannelScanner newScanner(Settings settings) throws ArgumentSyntaxException;

}