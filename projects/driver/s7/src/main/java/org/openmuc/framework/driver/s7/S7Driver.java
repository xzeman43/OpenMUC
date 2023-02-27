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



import org.openmuc.framework.driver.DriverActivator;
import org.openmuc.framework.driver.annotation.Driver;
import org.openmuc.framework.driver.spi.DriverService;
import org.osgi.service.component.annotations.Component;


@Component
@Driver(id = S7Driver.ID,
        name = S7Driver.NAME, description = S7Driver.DESCRIPTION,
        device =  S7DriverConnection.class)
public class S7Driver extends DriverActivator implements DriverService {

    public static final String ID = "s7";
    public static final String NAME = "S7 protocol";
    public static final String DESCRIPTION = "The S7 protocol for Siemens.";

}