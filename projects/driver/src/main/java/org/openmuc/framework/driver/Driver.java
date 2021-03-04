/*
 * Copyright 2011-2020 Fraunhofer ISE
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
package org.openmuc.framework.driver;

import java.text.MessageFormat;

import org.openmuc.framework.config.ArgumentSyntaxException;
import org.openmuc.framework.config.ScanException;
import org.openmuc.framework.config.ScanInterruptedException;
import org.openmuc.framework.dataaccess.DataAccessService;
import org.openmuc.framework.driver.spi.Connection;
import org.openmuc.framework.driver.spi.ConnectionException;
import org.openmuc.framework.driver.spi.DriverActivator;
import org.openmuc.framework.driver.spi.DriverDeviceScanListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class Driver<D extends Device<? extends DeviceChannel>> extends DeviceContext implements DriverActivator {

    private static final Logger logger = LoggerFactory.getLogger(Driver.class);

    DeviceScanner scanner;

    /**
     * Returns the ID of the driver. The ID may only contain ASCII letters, digits, hyphens and underscores. By
     * convention the ID should be meaningful and all lower case letters (e.g. "mbus", "modbus").
     * 
     * @return the unique ID of the driver.
     */
    public abstract String getId();

    /**
     * Returns the name of the driver. The name should be meaningfull to decorate the driver (e.g. "M-Bus", "Modbus").
     * 
     * @return the unique name of the driver.
     */
    public String getName() {
        // Placeholder for the optional implementation
        String id = getId();
        return id.substring(0, 1).toUpperCase() + 
               id.substring(1, id.length());
    }

    /**
     * Returns the description of the driver. The description should provide a short summary of the functionality 
     * and/or purpose of the driver.
     * 
     * @return the description of the driver.
     */
    public String getDescription() {
        // Placeholder for the optional implementation
        return MessageFormat.format("Driver implementation for the {0} protocol", getName());
    }

    @Override
    public final DriverContext getInfo() {
        return getContext();
    }

    public Driver() {
    	super();
        try {
			this.context = new DriverContext(this);
	        doCreate(context);
	        
		} catch (Exception e) {
            logger.warn("Error instancing driver {}: {}", getContext().getId(), e.getMessage());
		}
    }

    void doCreate(DriverContext context) throws Exception {
        onCreate(context);
    }

    protected void onCreate(DriverContext context) throws Exception {
        // Placeholder for the optional implementation
    }

    @Override
    public final void activate(DataAccessService dataAccess) {
        try {
            doActivate(dataAccess);
            
        } catch (Exception e) {
            logger.warn("Error activating driver {}: {}", getContext().getId(), e.getMessage());
        }
    }

    void doActivate(DataAccessService dataAccess) throws Exception {
        onActivate(dataAccess);
        onActivate();
    }

    protected void onActivate(DataAccessService dataAccess) throws Exception {
        // Placeholder for the optional implementation
    }

    protected void onActivate() throws Exception {
        // Placeholder for the optional implementation
    }

    @Override
    public final void deactivate() {
        try {
            doDeactivate();
            
        } catch (Exception e) {
            logger.warn("Error deactivating driver {}: {}", getContext().getId(), e.getMessage());
        }
    }

    void doDeactivate() throws Exception {
        onDeactivate();
    }

    protected void onDeactivate() throws Exception {
        // Placeholder for the optional implementation
    }

    @Override
    public final void scanForDevices(String settings, DriverDeviceScanListener listener) 
            throws UnsupportedOperationException, ArgumentSyntaxException, ScanException, ScanInterruptedException {
        scanner = newScanner(settings);
        scanner.doCreate(this);
        scanner.doConfigure(settings);
        scanner.doScan(listener);
    }

    @Override
    public final void interruptDeviceScan() throws UnsupportedOperationException {
        if (scanner != null) {
            scanner.onScanInterrupt();
        }
    }

    @Override
    public final Connection connect(String address, String settings) throws ArgumentSyntaxException, ConnectionException {
        Device<?> device = newDevice(address, settings);
        device.doCreate(this);
        device.doConfigure(address, settings);
        device.doConnect();
        
        return device;
    }

    @Override
    public void onConnect(Connection connection) {
        // Placeholder for the optional implementation
    }

    @Override
    public void onDisconnect(Connection connection) {
        // Placeholder for the optional implementation
    }

}
