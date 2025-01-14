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
package org.openmuc.framework.lib.rest.objects;

import java.util.List;

import org.openmuc.framework.config.ChannelConfig;
import org.openmuc.framework.config.IdCollisionException;
import org.openmuc.framework.config.ServerMapping;
import org.openmuc.framework.data.Flag;
import org.openmuc.framework.data.Record;
import org.openmuc.framework.data.Value;
import org.openmuc.framework.data.ValueType;
import org.openmuc.framework.dataaccess.Channel;
import org.openmuc.framework.lib.rest.exceptions.RestConfigIsNotCorrectException;

public class RestChannelMapper {

    public static RestChannel getRestChannel(Channel c) {

        RestChannel rc = new RestChannel();
        rc.setId(c.getId());
        if (c.getLatestRecord() != null) {
            Record r = c.getLatestRecord();
            
            RestRecord rr = new RestRecord();
            rr.setTimestamp(r.getTimestamp());
            
            Flag flag = r.getFlag();
            Value value = r.getValue();
            ValueType valueType = c.getValueType();
            if (valueType != null){
                rc.setValueType(c.getValueType());
            }
            if (value != null) {
                switch (c.getValueType()) {
                case FLOAT:
                    if (Float.isInfinite(value.asFloat())) {
                        flag = Flag.VALUE_IS_INFINITY;
                    }
                    else if (Float.isNaN(value.asFloat())) {
                        flag = Flag.VALUE_IS_NAN;
                    }
                    rr.setValue(value.asFloat());
                    break;
                case DOUBLE:
                    if (Double.isInfinite(value.asDouble())) {
                        flag = Flag.VALUE_IS_INFINITY;
                    }
                    else if (Double.isNaN(value.asDouble())) {
                        flag = Flag.VALUE_IS_NAN;
                    }
                    rr.setValue(value.asDouble());
                    break;
                case SHORT:
                    rr.setValue(value.asShort());
                    break;
                case INTEGER:
                    rr.setValue(value.asInt());
                    break;
                case LONG:
                    rr.setValue(value.asLong());
                    break;
                case BYTE:
                    rr.setValue(value.asByte());
                    break;
                case BOOLEAN:
                    rr.setValue(value.asBoolean());
                    break;
                case BYTE_ARRAY:
                    rr.setValue(value.asByteArray());
                    break;
                case STRING:
                    rr.setValue(value.asString());
                    break;
                default:
                    rr.setValue(null);
                    break;
                }
            }
            else {
                rr.setValue(null);
            }
            rr.setFlag(flag);
            rc.setRecord(rr);
        }
        
        return rc;
    }

    public static RestChannelConfig getRestChannelConfig(ChannelConfig cc) {

        RestChannelConfig rcc = new RestChannelConfig();
        rcc.setId(cc.getId());
        rcc.setDescription(cc.getDescription());
        rcc.setAddress(cc.getAddress());
        rcc.setSettings(cc.getSettings());
        rcc.setServerMappings(cc.getServerMappings());
        rcc.setUnit(cc.getUnit());
        rcc.setValueType(cc.getValueType());
        rcc.setValueTypeLength(cc.getValueTypeLength());
        rcc.setValueOffset(cc.getValueOffset());
        rcc.setScalingFactor(cc.getScalingFactor());
        rcc.setListening(cc.isListening());
        rcc.setSamplingInterval(cc.getSamplingInterval());
        rcc.setSamplingTimeOffset(cc.getSamplingTimeOffset());
        rcc.setSamplingGroup(cc.getSamplingGroup());
        rcc.setLoggingInterval(cc.getLoggingInterval());
        rcc.setLoggingTimeMax(cc.getLoggingDelayMaximum());
        rcc.setLoggingTimeOffset(cc.getLoggingTimeOffset());
        rcc.setLoggingSettings(cc.getLoggingSettings());
        rcc.setLoggingTolerance(cc.getLoggingTolerance());
        rcc.setloggingAverage(cc.isloggingAverage());
        rcc.setLoggingEvent(cc.isLoggingEvent());
        rcc.setDisabled(cc.isDisabled());
        return rcc;
    }

    public static void setChannelConfig(ChannelConfig cc, RestChannelConfig rcc, String idFromUrl)
            throws IdCollisionException, RestConfigIsNotCorrectException {
        if (cc == null) {
            throw new RestConfigIsNotCorrectException("ChannelConfig is null!");
        }

        if (rcc == null) {
            throw new RestConfigIsNotCorrectException();
        }

        if (rcc.getId() != null && !rcc.getId().isEmpty() && !idFromUrl.equals(rcc.getId())) {
            cc.setId(rcc.getId());
        }
        cc.setDescription(rcc.getDescription());
        cc.setAddress(rcc.getAddress());
        cc.setSettings(rcc.getSettings());
        List<ServerMapping> serverMappings = rcc.getServerMappings();
        if (serverMappings != null) {
            for (ServerMapping serverMapping : cc.getServerMappings()) {
                cc.deleteServerMappings(serverMapping.getId());
            }
            for (ServerMapping restServerMapping : serverMappings) {
                cc.addServerMapping(restServerMapping);
            }
        }
        cc.setUnit(rcc.getUnit());
        cc.setValueType(rcc.getValueType());
        cc.setValueTypeLength(rcc.getValueTypeLength());
        cc.setValueOffset(rcc.getValueOffset());
        cc.setScalingFactor(rcc.getScalingFactor());
        cc.setListening(rcc.isListening());
        cc.setSamplingGroup(rcc.getSamplingGroup());
        cc.setSamplingInterval(rcc.getSamplingInterval());
        cc.setSamplingTimeOffset(rcc.getSamplingTimeOffset());
        cc.setLoggingInterval(rcc.getLoggingInterval());
        cc.setLoggingDelayMaximum(rcc.getLoggingTimeMax());
        cc.setLoggingTimeOffset(rcc.getLoggingTimeOffset());
        cc.setLoggingSettings(rcc.getLoggingSettings());
        cc.setLoggingTolerance(rcc.getLoggingTolerance());
        cc.setloggingAverage(rcc.isloggingAverage());
        cc.setLoggingEvent(rcc.isLoggingEvent());
        cc.setDisabled(rcc.isDisabled());
    }

}
