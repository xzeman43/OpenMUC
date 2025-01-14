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
package org.openmuc.framework.driver.s7;

import org.openmuc.framework.config.option.annotation.Option;
import org.openmuc.framework.data.ValueType;
import org.openmuc.framework.driver.DriverChannel;

import static org.openmuc.framework.config.option.annotation.OptionType.ADDRESS;
import static org.openmuc.framework.config.option.annotation.OptionType.SETTING;

public class S7Channel extends DriverChannel {

    public int getArea() {
        return area;
    }

    public String getPlace() {
        return place;
    }

//    public int getLength() {
//        return length;
//    }

    public int getDbNum() {
        return dbNum;
    }

    @Option(id = "area",
            type = ADDRESS,
            name = "Area",
            description = "Area number from which to read.")
    private int area = 0x81;


    @Option(id = "place",
            type = SETTING,
            name="Value location",
            description="Value location to read. for digital inputs in format: Ix.x, for digital outputs Ox.x .",
            mandatory = false)
    private String place;

//    @Option(id = "length",
//            type = SETTING,
//            name="Datatype length",
//            description="Length in bytes of the datatype of the DB's stored value. Needed when DB reading is selected.",
//            mandatory = false)
//    private int length;

    @Option(id = "dbnum",
            type = SETTING,
            name="Database number",
            description="Number of the database where the data is stored. Needed when DB reading is selected.",
            mandatory = false)
    private int dbNum;

    public int getValueLength(ValueType type) {
        switch (type) {
            case BOOLEAN:
                return 1;
            case BYTE:
                return 1;
            case SHORT:
                return 2;
            case INTEGER:
                return 4;
            case LONG:
                return 4;
            case FLOAT:
                return 4;
            case DOUBLE:
                return 4;
            default:
                return 1;
        }
    }

//    public Record createRecord(Byte buffer) {
//        long timestamp = System.currentTimeMillis();
//        Object value = data.getValue().getValue();
//        switch (getValueType()) {
//            case BOOLEAN:
//                return new Record(new BooleanValue((Boolean) value), timestamp);
//            case BYTE:
//                return new Record(new ByteValue((Byte) value), timestamp);
//            case SHORT:
//                return new Record(new ShortValue((Short) value), timestamp);
//            case INTEGER:
//                return new Record(new IntValue((Integer) value), timestamp);
//            case LONG:
//                return new Record(new LongValue((Long) value), timestamp);
//            case FLOAT:
//                return new Record(new FloatValue((Float) value), timestamp);
//            case DOUBLE:
//                return new Record(new DoubleValue((Double) value), timestamp);
//            default:
//                return new Record(new StringValue((String) value), timestamp);
//        }

}
