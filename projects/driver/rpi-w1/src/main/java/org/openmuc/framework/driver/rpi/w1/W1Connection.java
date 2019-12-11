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
package org.openmuc.framework.driver.rpi.w1;

import java.util.List;

import org.openmuc.framework.driver.rpi.w1.configs.W1Channel;
import org.openmuc.framework.driver.spi.ConnectionException;
import org.openmuc.framework.driver.spi.Device;

public abstract class W1Connection extends Device<W1Channel> {

    private final String id;

    public W1Connection(String id) {
        this.id = id;
    }

    public String getId() {
    	return id;
    }

    @Override
    public abstract Object onRead(List<W1Channel> channels, Object containerListHandle, String samplingGroup) 
    		throws ConnectionException;

}
