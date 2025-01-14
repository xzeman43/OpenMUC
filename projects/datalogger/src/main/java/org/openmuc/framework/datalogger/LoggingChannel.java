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
package org.openmuc.framework.datalogger;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.openmuc.framework.config.ArgumentSyntaxException;
import org.openmuc.framework.config.Settings;
import org.openmuc.framework.data.DoubleValue;
import org.openmuc.framework.data.Flag;
import org.openmuc.framework.data.FloatValue;
import org.openmuc.framework.data.IntValue;
import org.openmuc.framework.data.LongValue;
import org.openmuc.framework.data.Record;
import org.openmuc.framework.data.ShortValue;
import org.openmuc.framework.data.TypeConversionException;
import org.openmuc.framework.data.Value;
import org.openmuc.framework.datalogger.annotation.Read;
import org.openmuc.framework.datalogger.annotation.Write;
import org.openmuc.framework.datalogger.spi.LogChannel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class LoggingChannel extends ChannelWrapper {

    private static final Logger logger = LoggerFactory.getLogger(LoggingChannel.class);

    LoggingChannelContext context;

    Record record = new Record(Flag.DATA_LOGGING_NOT_ACTIVE);

    final List<Record> records = new ArrayList<Record>();

    void invokeConfigure(LoggingChannelContext context, LogChannel channel, Settings settings) 
            throws ArgumentSyntaxException {
        
        this.context = context;
        super.invokeConfigure(context, channel, settings);
    }

    final void invokeWrite(long timestamp) throws IOException {
        invokeMethod(Write.class, this, getRecord(), timestamp);
        invokeMethod(Write.class, this, getRecord());
    }

    @SuppressWarnings("unchecked")
    final List<Record> invokeRead(long startTime, long endTime) throws IOException {
        List<Record> records = (List<Record>) invokeReturn(Read.class, this, startTime, endTime);
        return records;
    }

    final Record invokeRead() throws IOException {
        Record record = (Record) invokeReturn(Read.class, this);
        return record;
    }

    boolean isUpdate(Record record) {
        if (Flag.VALID != record.getFlag()) {
            logger.trace("Skipped logging value of channel \"{}\" for unchanged flag: {}", getId(), record.getFlag());
            return false;
        }
        if (getRecord() == null) {
            return true;
        }
        if (getRecord().getFlag() != record.getFlag()) {
            return true;
        }
        if (getRecord().getTimestamp() != null && getRecord().getTimestamp() >= record.getTimestamp()) {
            if (isLoggingDynamic() && 
                    System.currentTimeMillis() - getRecord().getTimestamp() >= getLoggingDelayMaximum()) {
                return true;
            }
            logger.trace("Skipped logging value of channel \"{}\" with invalid timestamp: {}", getId(), record.getTimestamp());
            return false;
        }
        if (isLoggingDynamic()) {
            if (record.getTimestamp() - getRecord().getTimestamp() >= getLoggingDelayMaximum()) {
                return true;
            }
            switch(channel.getValueType()) {
            case INTEGER:
            case SHORT:
            case LONG:
            case FLOAT:
            case DOUBLE:
                double delta = Math.abs(record.getValue().asDouble() - getRecord().getValue().asDouble());
                if (getLoggingTolerance() >= delta) {
                    if (logger.isTraceEnabled()) {
                        logger.trace("Skipped logging value of channel \"{}\" inside tolerance: {} -> {} <= {}", getId(), 
                                getRecord().getValue().asDouble(), record.getValue(), getLoggingTolerance());
                    }
                    return false;
                }
            default:
                break;
            }
        }
        return true;
    }

    void updateRecord(Record record) {
        long timestamp = record.getTimestamp();
        
        if (isLoggingDynamic() && getRecord().getTimestamp() != null && 
                System.currentTimeMillis() - getRecord().getTimestamp() >= getLoggingDelayMaximum()) {
            timestamp = System.currentTimeMillis();
            
            if (!isAveraging()) {
                record = new Record(record.getValue(), timestamp);
            }
        }
        if (isAveraging() && records.size() > 0) {
            double average = records.stream().mapToDouble(c -> c.getValue().asDouble())
                    .average().getAsDouble();
            
            switch (getValueType()) {
            case SHORT:
                record = new Record(new ShortValue((short) Math.round(average)), timestamp);
                break;
            case INTEGER:
                record = new Record(new IntValue((int) Math.round(average)), timestamp);
                break;
            case LONG:
                record = new Record(new LongValue((long) Math.round(average)), timestamp);
                break;
            case FLOAT:
                record = new Record(new FloatValue((float) average), timestamp);
                break;
            case DOUBLE:
                record = new Record(new DoubleValue(average), timestamp);
                break;
            default:
                break;
            }
            logger.trace("Average of {} values for channel \"{}\": {}", records.size(), channel.getId(), average);
            records.clear();
        }
        this.record = record;
    }

    boolean update(Record record) {
        if (isValid(record) && isAveraging()) {
            records.add(record);
        }
        if (isUpdate(record)) {
            updateRecord(record);
            return true;
        }
        return false;
    }

    public final Record getRecord() {
        return record;
    }

    public boolean isValid() {
        return isValid(getRecord());
    }

    protected boolean isValid(Record record) {
        if (record == null) {
            logger.trace("Invalid null record for channel \"{}\"", getId());
            return false;
        }
        if (!record.isValid()) {
            logger.trace("Invalid record for channel \"{}\" with flag: {}", getId(), record.getFlag());
            return false;
        }
        if (record.getValue() == null) {
            logger.trace("Invalid record for channel \"{}\" with null value", getId());
            return false;
        }
        Value value = record.getValue();
        try {
            switch (getValueType()) {
            case BOOLEAN:
                value.asBoolean();
                break;
            case BYTE:
                value.asByte();
                break;
            case BYTE_ARRAY:
                value.asByteArray();
                break;
            case SHORT:
                value.asShort();
                break;
            case INTEGER:
                value.asInt();
                break;
            case LONG:
                value.asLong();
                break;
            case FLOAT:
                value.asFloat();
                break;
            case DOUBLE:
                Double doubleValue = value.asDouble();
                if (doubleValue.isNaN()) {
                    logger.trace("Invalid record for channel \"{}\" with NaN value", getId());
                    return false;
                }
                break;
            default:
                break;
            }
        } catch (TypeConversionException e) {
            logger.warn("Invalid record of channel \"{}\" for value type {}: {}", 
                    getId(), getValueType(), getRecord());
            
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return getId()+" ("+getValueType().toString()+"): "+getRecord().toString();
    }

}
