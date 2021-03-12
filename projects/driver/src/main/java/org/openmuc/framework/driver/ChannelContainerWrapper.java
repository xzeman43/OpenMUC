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
package org.openmuc.framework.driver;

import org.openmuc.framework.config.ArgumentSyntaxException;
import org.openmuc.framework.config.Configurable;
import org.openmuc.framework.data.Flag;
import org.openmuc.framework.data.Record;
import org.openmuc.framework.dataaccess.ChannelContainer;
import org.openmuc.framework.driver.spi.ChannelRecordContainer;
import org.openmuc.framework.driver.spi.ChannelTaskContainer;
import org.openmuc.framework.driver.spi.ChannelValueContainer;

public abstract class ChannelContainerWrapper extends Configurable { //implements ChannelRecordContainer {

    public static enum ChannelTaskType {
        WRITE,
        READ;
    }
    ChannelTaskType containerType;
    ChannelTaskContainer container;

    protected ChannelContainerWrapper() {
    }

    protected void doConfigure(ChannelTaskContainer container) throws ArgumentSyntaxException {
        if (!equals(container)) {
            doConfigure(container.getChannel().getAddress(), container.getChannel().getSettings());
            onConfigure();
        }
        setTaskContainer(container);
    }

    protected void doConfigure(String address, String settings) throws ArgumentSyntaxException {
        configure(address, settings);
    }

    protected void onConfigure() throws ArgumentSyntaxException {
        // Placeholder for the optional implementation
    }

    public final ChannelTaskType getTaskType() {
    	return containerType;
    }

    public final ChannelTaskContainer getTaskContainer() {
        return container;
    }

    final void setTaskContainer(ChannelTaskContainer container) throws ArgumentSyntaxException {
        this.container = container;
        if (container instanceof ChannelRecordContainer) {
            containerType = ChannelTaskType.READ;
        }
        else if (container instanceof ChannelValueContainer) {
            containerType = ChannelTaskType.WRITE;
        }
        else {
            throw new ArgumentSyntaxException("Invalid channel container: " + container.getClass().getSimpleName());
        }
    }

//	@Override
//	public Channel getChannel() {
//		return container.getChannel();
//	}
//
//	@Override
//	public Object getChannelHandle() {
//		return container.getChannelHandle();
//	}
//
//	@Override
//	public void setChannelHandle(Object handle) {
//		container.setChannelHandle(handle);
//	}

    public final Record getRecord() {
        switch (containerType) {
        default:
        case READ:
            return getRecord((ChannelRecordContainer) container);
        case WRITE:
            return getRecord((ChannelValueContainer) container);
        }
    }

    private final Record getRecord(ChannelRecordContainer container) {
        return container.getRecord();
    }

    private final Record getRecord(ChannelValueContainer container) {
        return new Record(container.getValue(), System.currentTimeMillis());
    }

    public final void setRecord(Record record) {
        switch (containerType) {
        default:
        case READ:
            setRecord((ChannelRecordContainer) container, record);
            break;
        case WRITE:
            setRecord((ChannelValueContainer) container, record);
            break;
        }
    }

    private final void setRecord(ChannelRecordContainer container, Record record) {
        container.setRecord(record);
    }

    private final void setRecord(ChannelValueContainer container, Record record) {
        container.setFlag(record.getFlag());
    }

    public final void setFlag(Flag flag) {
        switch (containerType) {
        default:
        case READ:
            setFlag((ChannelRecordContainer) container, flag);
            break;
        case WRITE:
            setFlag((ChannelValueContainer) container, flag);
            break;
        }
    }

    private final void setFlag(ChannelRecordContainer container, Flag flag) {
        container.setRecord(new Record(flag));
    }

    private final void setFlag(ChannelValueContainer container, Flag flag) {
        container.setFlag(flag);
    }

    public boolean equals(ChannelContainer container) {
        return this.container != null && container != null &&
                this.container.getChannel().getId().equals(container.getChannel().getId()) &&
                this.container.getChannel().getSettings().equals(container.getChannel().getSettings()) &&
                this.container.getChannel().getAddress().equals(container.getChannel().getAddress());
    }

}
