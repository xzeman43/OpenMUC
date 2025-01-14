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
package org.openmuc.framework.driver.opcua;

import static org.openmuc.framework.config.option.annotation.OptionType.ADDRESS;
import static org.openmuc.framework.config.option.annotation.OptionType.SETTING;

import org.eclipse.milo.opcua.stack.core.types.builtin.DataValue;
import org.eclipse.milo.opcua.stack.core.types.builtin.NodeId;
import org.eclipse.milo.opcua.stack.core.types.builtin.StatusCode;
import org.eclipse.milo.opcua.stack.core.types.builtin.Variant;
import org.openmuc.framework.config.option.annotation.Option;
import org.openmuc.framework.data.BooleanValue;
import org.openmuc.framework.data.ByteValue;
import org.openmuc.framework.data.DoubleValue;
import org.openmuc.framework.data.FloatValue;
import org.openmuc.framework.data.IntValue;
import org.openmuc.framework.data.LongValue;
import org.openmuc.framework.data.Record;
import org.openmuc.framework.data.ShortValue;
import org.openmuc.framework.data.StringValue;
import org.openmuc.framework.data.Value;
import org.openmuc.framework.driver.DriverChannel;
import org.openmuc.framework.driver.annotation.Configure;

public class OpcChannel extends DriverChannel {

    @Option(id = "id",
            type = ADDRESS,
            name = "Identifier",
            description = "The identifier string for a node in the address space of an OPC UA server.")
    private String identifier;

    @Option(id="ns",
            type = SETTING,
            name = "Namespace index",
            description = "The namespace index formatted as a base 10 number. The index an OPC UA server uses "
                        + "for a namespace URI. The namespace URI identifies the naming authority defining the "
                        + "identifiers of NodeIds, e.g. the OPC Foundation, other standard bodies and consortia, "
                        + "the underlying system, the local server.",
            mandatory = false)
    private int namespaceIndex = -1;

    private NodeId nodeId;

    public NodeId getNodeId() {
        return nodeId;
    }

    @Configure
    public void setNamespace(OpcConnection connection) {
        if (namespaceIndex < 0) {
            namespaceIndex = connection.getNamespaceIndex();
        }
        nodeId = new NodeId(namespaceIndex, identifier);
    }

    public Record decode(DataValue data) {
        long timestamp = data.getServerTime().getJavaTime();
        Object value = data.getValue().getValue();
        switch (getValueType()) {
        case BOOLEAN:
            return new Record(new BooleanValue((Boolean) value), timestamp);
        case BYTE:
            return new Record(new ByteValue((Byte) value), timestamp);
        case SHORT:
            return new Record(new ShortValue((Short) value), timestamp);
        case INTEGER:
            return new Record(new IntValue((Integer) value), timestamp);
        case LONG:
            return new Record(new LongValue((Long) value), timestamp);
        case FLOAT:
            return new Record(new FloatValue((Float) value), timestamp);
        case DOUBLE:
            return new Record(new DoubleValue((Double) value), timestamp);    
        default:
            return new Record(new StringValue((String) value), timestamp);
        }
    }

    public DataValue encode() {
        Value value = getRecord().getValue();
        Variant variant;
        switch (getValueType()) {
        case BOOLEAN:
            variant = new Variant(value.asBoolean());
        case BYTE:
            variant = new Variant(value.asByte());
        case SHORT:
            variant = new Variant(value.asShort());
        case INTEGER:
            variant = new Variant(value.asInt());
        case LONG:
            variant = new Variant(value.asLong());
        case FLOAT:
            variant = new Variant(value.asFloat());
        case DOUBLE:
            variant = new Variant(value.asDouble());
        default:
            variant = new Variant(value.asString());
        }
        // FIXME: verify necessity of timestamp
        return new DataValue(variant, StatusCode.GOOD, null);
    }

}
