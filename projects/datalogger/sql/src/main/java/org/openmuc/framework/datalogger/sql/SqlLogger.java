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

package org.openmuc.framework.datalogger.sql;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Dictionary;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.openmuc.framework.config.ArgumentSyntaxException;
import org.openmuc.framework.data.Record;
import org.openmuc.framework.datalogger.DataLoggerActivator;
import org.openmuc.framework.datalogger.LoggingChannel;
import org.openmuc.framework.datalogger.annotation.DataLogger;
import org.openmuc.framework.datalogger.annotation.Read;
import org.openmuc.framework.datalogger.annotation.Write;
import org.openmuc.framework.datalogger.spi.DataLoggerService;
import org.openmuc.framework.lib.osgi.config.DictionaryPreprocessor;
import org.openmuc.framework.lib.osgi.config.PropertyHandler;
import org.openmuc.framework.lib.osgi.config.ServicePropertyException;
import org.openmuc.framework.lib.sql.Table;
import org.openmuc.framework.lib.sql.properties.PropertyHandlerProvider;
import org.openmuc.framework.lib.sql.properties.PropertySettings;
import org.osgi.service.cm.ManagedService;
import org.osgi.service.component.annotations.Deactivate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@DataLogger(id="sqllogger", channel = SqlChannel.class)
public class SqlLogger extends DataLoggerActivator implements DataLoggerService, ManagedService {
    private static final Logger logger = LoggerFactory.getLogger(SqlLogger.class);

    private final Map<String, SqlClient> clients = new HashMap<String, SqlClient>();

    private final PropertySettings properties;
    private final PropertyHandler propertyHandler;

//    private final List<LoggingRecord> eventBuffer = new ArrayList<>();
//    private SqlWriter writer;
//    private SqlReader reader;
//    private DbAccess database;
//    private List<LogChannel> channels;

    public SqlLogger() {
        logger.info("Activating SQL Logger");
        
        properties = new PropertySettings();
        propertyHandler = new PropertyHandler(properties, SqlLogger.class.getName());
        PropertyHandlerProvider.getInstance().setPropertyHandler(propertyHandler);
    }

    @SuppressWarnings("unchecked")
	private void configure() throws IOException {
        List<? extends LoggingChannel> channels = getChannels();
        configure((List<SqlChannel>) channels);
    }

    //@Configure
    public void configure(List<SqlChannel> channels) throws IOException {
        List<Thread> threads = new ArrayList<Thread>();
        for (SqlChannel channel : channels) {
        	SqlClient client;
        	try {
				channel.configure();
				client = clients.get(channel.getDatabaseUrl());
	            if (client == null) {
	                client = new SqlClient(channel);
	                threads.add(configure(client));
	                clients.put(client.getUrl(), client);
	            }
	            client.addChannel(channel);
                
            } catch (ArgumentSyntaxException | NullPointerException e) {
                logger.warn("Unable to configure channel \"{}\": {}", channel.getId(), e.getMessage());
            }
        }
        for (Thread t : threads) t.start();
    }

    protected Thread configure(SqlClient client) {
        // Instantiation needs to be in separate threads, as configure() is called by the regularly
        // interrupted DataManager main thread
        return new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                	client.open();
                    
                } catch (IOException e) {
                    logger.error("Error initializing SQL Data Logger: {}", e.getMessage());
                    client.close();
                    clients.remove(client.getUrl());
                }
            }
        });
    }

    @Override
    public void updated(Dictionary<String, ?> propertyDict) {
        DictionaryPreprocessor dict = new DictionaryPreprocessor(propertyDict);
        if (!dict.wasIntermediateOsgiInitCall()) {
            try {
                propertyHandler.processConfig(dict);
                if (propertyHandler.configChanged()) {
                    logger.info("Configuration changed. Applying new configurations: {}", propertyHandler.toString());
                    if (clients.size() > 0) {
                        shutdown();
                    }
                    configure();
                }
                else if (propertyHandler.isDefaultConfig() && clients.size() > 0) {
                    configure();
                }
            } catch (IOException | ServicePropertyException e) {
                logger.error("Configuration update failed", e);
                shutdown();
            }
        }
    }

    @Deactivate
    public void shutdown() {
        for (SqlClient client : clients.values()) {
            client.close();
        }
    }

    @Write
    public void write(List<Table> channels, long timestamp) throws IOException {
        for (SqlClient client : clients.values()) {
            client.write(timestamp);
        }
    }

    @Read
    public List<Record> read(SqlChannel channel, long startTime, long endTime) throws IOException {
        return clients.get(channel.getDatabaseUrl())
                      .read(channel, startTime, endTime);
    }

//    private void connect() {
//        database = new DbAccess();
//        writer = new SqlWriter(database);
//        reader = new SqlReader(database);
//        writeMetaToDb();
//        writer.writeEventBasedContainerToDb(eventBuffer);
//        eventBuffer.clear();
//    }
//
//    private void writeMetaToDb() {
//        MetaBuilder metaBuilder = new MetaBuilder(channels, database);
//        metaBuilder.writeMetaTable();
//
//        TableSetup tableSetup = new TableSetup(channels, database);
//        tableSetup.createOpenmucTables();
//    }
//
//    /**
//     * Closes the connection, stops the timer by calling its cancel Method and stops the h2 server, if the conditions
//     * for each are met, if a connection exists
//     */
//    public void shutdown() {
//        logger.info("Deactivating SQL Logger");
//        database.closeConnection();
//    }
//
//    @Override
//    public String getId() {
//        return "sqllogger";
//    }
//
//    /**
//     * Creates the metadata table to create the tables for each data type and to insert info about all the channel into
//     * the metadata table
//     */
//    @Override
//    public void setChannelsToLog(List<LogChannel> channels) {
//        this.channels = channels;
//    }
//
//    @Override
//    public void log(List<LoggingRecord> containers, long timestamp) {
//        if (writer == null) {
//            logger.warn("Sql connection not established!");
//            return;
//        }
//
//        writer.writeRecordContainerToDb(containers, timestamp);
//    }
//
//    @Override
//    public void logEvent(List<LoggingRecord> containers, long timestamp) {
//        if (writer == null) {
//            logger.debug("Sql connection not established!");
//            eventBuffer.addAll(containers);
//            return;
//        }
//
//        writer.writeEventBasedContainerToDb(containers);
//    }
//
//    @Override
//    public boolean logSettingsRequired() {
//        return false;
//    }
//
//    /**
//     * @return the queried data
//     */
//    @Override
//    public List<Record> getRecords(String channelId, long startTime, long endTime) throws IOException {
//        List<Record> records = reader.readRecordListFromDb(channelId, startTime, endTime);
//
//        return records;
//    }
//
//    @Override
//    public void updated(Dictionary<String, ?> propertyDict) {
//        DictionaryPreprocessor dict = new DictionaryPreprocessor(propertyDict);
//        if (!dict.wasIntermediateOsgiInitCall()) {
//            tryProcessConfig(dict);
//        }
//    }
//
//    private void tryProcessConfig(DictionaryPreprocessor newConfig) {
//        try {
//            propertyHandler.processConfig(newConfig);
//            if (propertyHandler.configChanged()) {
//                applyConfigChanges();
//            }
//            else if (propertyHandler.isDefaultConfig() && writer == null) {
//                connect();
//            }
//        } catch (ServicePropertyException e) {
//            logger.error("update properties failed", e);
//            shutdown();
//        }
//    }
//
//    private void applyConfigChanges() {
//        logger.info("Configuration changed - new configuration {}", propertyHandler.toString());
//        if (writer != null) {
//            shutdown();
//        }
//        connect();
//    }
}
