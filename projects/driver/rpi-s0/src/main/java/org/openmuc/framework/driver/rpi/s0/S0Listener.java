/*
 * Copyright 2011-16 Fraunhofer ISE
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
package org.openmuc.framework.driver.rpi.s0;

import java.util.List;

import org.openmuc.framework.config.ArgumentSyntaxException;
import org.openmuc.framework.data.DoubleValue;
import org.openmuc.framework.data.Flag;
import org.openmuc.framework.data.Record;
import org.openmuc.framework.data.Value;
import org.openmuc.framework.driver.rpi.s0.options.S0ChannelPreferences;
import org.openmuc.framework.driver.rpi.s0.options.S0DriverInfo;
import org.openmuc.framework.driver.spi.ChannelRecordContainer;
import org.openmuc.framework.driver.spi.RecordsReceivedListener;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pi4j.io.gpio.GpioPin;
import com.pi4j.io.gpio.PinEdge;
import com.pi4j.io.gpio.PinPullResistance;
import com.pi4j.io.gpio.event.GpioPinDigitalStateChangeEvent;
import com.pi4j.io.gpio.event.GpioPinListenerDigital;

@Component
public class S0Listener implements GpioPinListenerDigital {
    private final static Logger logger = LoggerFactory.getLogger(S0Listener.class);
    private final S0DriverInfo info = S0DriverInfo.getInfo();

    private List<ChannelRecordContainer> containers = null;
    private RecordsReceivedListener listener = null;

    private final int bounceTime;
    private final PinEdge edge;
    private final GpioPin pin;
    
    private Long lastSamplingTime = null;
    private volatile Integer counter;

    public S0Listener(GpioPin pin, PinPullResistance pullResistance, int bounceTime) {
        this.pin = pin;
        this.bounceTime = bounceTime;
        if (pullResistance == PinPullResistance.PULL_UP) {
            edge = PinEdge.FALLING;
        }
        else edge = PinEdge.RISING;
        
        this.counter = 0;
    }

    public void setRecordListener(List<ChannelRecordContainer> containers, RecordsReceivedListener listener) {
        this.containers = containers;
        this.listener = listener;
    }

    public int getValue() {
        return this.counter;
    }

    @Override
    public void handleGpioPinDigitalStateChangeEvent(GpioPinDigitalStateChangeEvent event) {
        if (event.getPin() == pin && event.getEdge() == edge) {
            long samplingTime = System.currentTimeMillis();
            
            if (lastSamplingTime == null || samplingTime - lastSamplingTime > bounceTime) {
                synchronized (this.counter) {
                	
                    this.counter++;
                    
                    if (listener != null && containers != null) {
                        for (ChannelRecordContainer container : containers) {
                            try {
                                S0ChannelPreferences prefs = info.getChannelPreferences(container);
                                
                                Value value = null;
                                if (prefs.isDerivative() && lastSamplingTime != null) {
                                	double counterDelta = 1.0/(double) prefs.getImpulses();
                                	long timeDelta = (samplingTime - lastSamplingTime)/3600000;
                                	if (timeDelta > 0) {
                                        value = new DoubleValue(counterDelta/timeDelta);
                                	}
                                }
                                else {
                                	value = new DoubleValue(this.counter/(double) prefs.getImpulses());
                                }
                                if (value != null) {
                                    container.setRecord(new Record(value, samplingTime, Flag.VALID));
                                }
                            } catch (ArgumentSyntaxException e) {
                                logger.warn("Unable to configure channel address \"{}\": {}", container.getChannelAddress(), e.getMessage());
                                container.setRecord(new Record(null, samplingTime, Flag.DRIVER_ERROR_CHANNEL_ADDRESS_SYNTAX_INVALID));
                            }
                        }
                        listener.newRecords(containers);
                    }
                    lastSamplingTime = samplingTime;
                }
            }
        }
    }

}
