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
package org.openmuc.framework.config;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.MessageFormat;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import org.openmuc.framework.config.annotation.Address;
import org.openmuc.framework.config.annotation.Setting;
import org.openmuc.framework.data.Value;

public abstract class Configurable {

    protected Configurable() {
    }

    protected void configure(String addressStr, String settingsStr) throws ArgumentSyntaxException {
        configureAddress(addressStr);
        configureSettings(settingsStr);
    }

    protected void configureAddress(String addressStr) throws ArgumentSyntaxException {
        Configurations configs = Configurations.parseAddress(addressStr, getClass());

        List<Field> fields = getFields();
        for (Field field : fields) {
            Address annotation = field.getAnnotation(Address.class);
            if (annotation == null) {
                continue;
            }
            String id = annotation.id()[0];
            if (id.isEmpty() || id.equals(Address.DEFAULT)) {
                id = annotation.value();
            }
            if (id.isEmpty() || id.equals(Address.DEFAULT)) {
                id = field.getName();
            }
            setField(field, configs.get(id));
        }
    }

    protected void configureSettings(String settingsStr) throws ArgumentSyntaxException {
        Configurations configs = Configurations.parseSettings(settingsStr, getClass());
        
        List<Field> fields = getFields();
        for (Field field : fields) {
            Setting annotation = field.getAnnotation(Setting.class);
            if (annotation == null) {
                continue;
            }
            String id = annotation.id()[0];
            if (id.isEmpty() || id.equals(Setting.DEFAULT)) {
                id = annotation.value();
            }
            if (id.isEmpty() || id.equals(Setting.DEFAULT)) {
                id = field.getName();
            }
            setField(field, configs.get(id));
        }
    }

    private List<Field> getFields() {
        List<Field> fields = new LinkedList<Field>();
        
        Class<?> type = this.getClass();
        while(type.getSuperclass() != null) {
            fields.addAll(Arrays.asList(type.getDeclaredFields()));
            type = type.getSuperclass();
        }
        return fields;
    }

    private void setField(Field field, Value value) throws ArgumentSyntaxException {
        if (value != null) {
            try {
                Object object = extractValue(field, value);
                
                field.setAccessible(true);
                field.set(this, object);
                
            } catch (IllegalAccessException | NoSuchFieldException e) {
                throw new ArgumentSyntaxException(MessageFormat.format("Error parsing parameter of \"{0}\": {1}", 
                        this.getClass().getSimpleName(), e.getMessage()));
            }
        }
    }

    private Object extractValue(Field field, Value value)
            throws ArgumentSyntaxException, IllegalAccessException, NoSuchFieldException {
        
        field.setAccessible(true);
        
        Class<?> type = field.getType();
        if (type.isAssignableFrom(boolean.class) || type.isAssignableFrom(Boolean.class)) {
            return value.asBoolean();
        }
        else if (type.isAssignableFrom(byte.class) || type.isAssignableFrom(Byte.class)) {
            return value.asByte();
        }
        else if (type.isAssignableFrom(short.class) || type.isAssignableFrom(Short.class)) {
            return value.asShort();
        }
        else if (type.isAssignableFrom(int.class) || type.isAssignableFrom(Integer.class)) {
            return value.asInt();
        }
        else if (type.isAssignableFrom(long.class) || type.isAssignableFrom(Long.class)) {
            return value.asLong();
        }
        else if (type.isAssignableFrom(float.class) || type.isAssignableFrom(Float.class)) {
            return value.asFloat();
        }
        else if (type.isAssignableFrom(double.class) || type.isAssignableFrom(Double.class)) {
            return value.asDouble();
        }
        else if (type.isAssignableFrom(String.class)) {
            return value.asString();
        }
        else if (type.isAssignableFrom(byte[].class)) {
            return value.asByteArray();
        }
        else if (type.isAssignableFrom(InetAddress.class)) {
            return extractInetAddress(value);
        }
        else {
            return extractValueOf(type, value);
        }
    }

    private InetAddress extractInetAddress(Value value) throws ArgumentSyntaxException {
        try {
            return InetAddress.getByName(value.asString());
        } catch (UnknownHostException e) {
            throw new ArgumentSyntaxException(MessageFormat.format("Value of {0} in {1} is not type of {2}.", 
                    value.asString(), this.getClass().getSimpleName(), InetAddress.class.getSimpleName()));
        }
    }

    private Object extractValueOf(Class<?> type, Value value) throws ArgumentSyntaxException, NoSuchFieldException {
        Method method = null;
        try {
            method = type.getMethod("valueOf", String.class);
            
        } catch (NoSuchMethodException | SecurityException e) {
            // check if method is null and procees
        }
        if (method == null) {
            throw new NoSuchFieldException(
                    type + "  Driver implementation error not supported data type. Report driver developer\n");
        }
        
        try {
            if (type.isEnum()) {
                return method.invoke(null, value.asString().toUpperCase());
            }
            return method.invoke(null, value.asString());
            
        } catch (IllegalAccessException | IllegalArgumentException | InvocationTargetException e) {
            throw new ArgumentSyntaxException(MessageFormat.format("Value of {0} in {1} is not type of {2}.", 
                    value.asString(), this.getClass().getSimpleName(), type.getSimpleName()));
        }
    }

}