/*
 * Copyright 2011-18 Fraunhofer ISE
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
package org.openmuc.framework.datalogger.sql.time;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.openmuc.framework.datalogger.sql.Index;


public class TimestampIndex extends Index {

    protected final SimpleDateFormat format;

    public TimestampIndex(String column, String format) {
        super(column);
        this.format = new SimpleDateFormat(format);
    }

    @Override
    public long decode(ResultSet result) throws SQLException {
        return result.getTimestamp(column).getTime();
    }

    @Override
    public String encode(long timestamp) {
        return format.format(new Date(timestamp));
    }

}