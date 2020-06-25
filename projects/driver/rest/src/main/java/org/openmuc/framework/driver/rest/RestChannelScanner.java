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
package org.openmuc.framework.driver.rest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.openmuc.framework.config.ArgumentSyntaxException;
import org.openmuc.framework.config.ChannelScanInfo;
import org.openmuc.framework.config.ScanException;
import org.openmuc.framework.driver.ChannelScanner;
import org.openmuc.framework.driver.spi.ConnectionException;
import org.openmuc.framework.lib.json.FromJson;
import org.openmuc.framework.lib.json.rest.objects.RestChannel;

public class RestChannelScanner extends ChannelScanner {

    private final RestConfigs configs;

    public RestChannelScanner(RestConfigs configs) {
        this.configs = configs;
    }

    @Override
    public List<ChannelScanInfo> doScan() throws ArgumentSyntaxException, ScanException, ConnectionException {
        List<ChannelScanInfo> channelScanInfos = new ArrayList<>();
        try (RestConnection connection = new RestConnection(configs)) {
            FromJson json = new FromJson(connection.get(""));
            List<RestChannel> channels = json.getRestChannelList();
            
            for (RestChannel channel : channels) {
                // TODO: get channel config list with valueTypeLength, description, ...
                ChannelScanInfo channelScanInfo = new ChannelScanInfo(channel.getId(), "", channel.getValueType(), 0);
                channelScanInfos.add(channelScanInfo);
            }
        } catch (IOException e) {
            throw new ConnectionException(e.getMessage());
        }
        return channelScanInfos;
    }

}