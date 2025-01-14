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
package org.openmuc.framework.driver.csv;

import static org.openmuc.framework.config.option.annotation.OptionType.ADDRESS;
import static org.openmuc.framework.config.option.annotation.OptionType.SETTING;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.openmuc.framework.config.Address;
import org.openmuc.framework.config.ArgumentSyntaxException;
import org.openmuc.framework.config.Settings;
import org.openmuc.framework.config.option.annotation.Option;
import org.openmuc.framework.driver.DriverChannelFactory;
import org.openmuc.framework.driver.DriverDevice;
import org.openmuc.framework.driver.annotation.Connect;
import org.openmuc.framework.driver.annotation.Device;
import org.openmuc.framework.driver.csv.channel.CsvChannel;
import org.openmuc.framework.driver.csv.channel.CsvChannelHHMMSS;
import org.openmuc.framework.driver.csv.channel.CsvChannelLine;
import org.openmuc.framework.driver.csv.channel.CsvChannelUnixtimestamp;
import org.openmuc.framework.driver.spi.ConnectionException;

@Device(scanner = ColumnScanner.class)
public class CsvFile extends DriverDevice implements DriverChannelFactory {

    public static final String SAMPLING_MODE = "samplingmode";

    @Option(type = ADDRESS,
            name = "CSV file path",
            description = "The systems path to the CSV file.<br><br>" + 
                          "<b>Example:</b> /home/usr/bin/openmuc/csv/meter.csv"
    )
    private String filePath;

    @Option(id = SAMPLING_MODE,
            type = SETTING,
            name = "Sampling mode",
            description = "The sampling mode configures the drivers method to read the CSV file:<br><br>" + 
                          "<b>Modes:</b>" + 
                          "<ol>" + 
                              "<li><b>Unix timestamp</b>: Find the line closest to the sampling timestamp in the <em>unixtimestamp</em> column.</li>" + 
                              "<li><b>Closest time</b>: Find the line closest to the sampling times hours, minutes and seconds in the <em>hhmmss</em> column.</li>" + 
                              "<li><b>Line by line</b>: Read the file line by line.</li>" + 
                          "</ol>",
            valueSelection = "unixtimestamp:Unix timestamp,hhmmss:Closest time,line:Line by line",
            valueDefault = "line"
    )
    private SamplingMode samplingMode;

    @Option(type = SETTING,
            name = "Rewind",
            description = "Start from the beginning of the file again, when the end was reached.",
            valueDefault = "false",
            mandatory = false
    )
    private boolean rewind = false;

    /** Map containing 'column name' as key and 'list of all column data' as value */
    protected Map<String, List<String>> data;

    public Map<String, List<String>> getData() {
        return data;
    }

    public List<String> getColumns() {
        return new ArrayList<String>(data.keySet());
    }

    @Connect
    public void connect() throws ArgumentSyntaxException, ConnectionException {
        data = CsvFileReader.readCsvFile(filePath);
        switch (samplingMode) {
        case UNIXTIMESTAMP:
            if (!data.containsKey(CsvChannelUnixtimestamp.INDEX) || 
                    data.get(CsvChannelUnixtimestamp.INDEX).isEmpty()) {
                throw new ArgumentSyntaxException("unixtimestamp column not availiable in file or empty");
            }
        case HHMMSS:
            if (!data.containsKey(CsvChannelHHMMSS.INDEX) || 
                    data.get(CsvChannelHHMMSS.INDEX).isEmpty()) {
                throw new ArgumentSyntaxException("hhmmss column not availiable in file or empty");
            }
        default:
            break;
        }
    }

    @Override
    public CsvChannel newChannel(Address address, Settings settings) throws ArgumentSyntaxException {
        switch (samplingMode) {
        case UNIXTIMESTAMP:
            return new CsvChannelUnixtimestamp(address.toString(), data, rewind);

        case HHMMSS:
            return new CsvChannelHHMMSS(address.toString(), data, rewind);

        case LINE:
            return new CsvChannelLine(address.toString(), data, rewind);

        default:
            throw new ArgumentSyntaxException("Invalid sampling mode " + samplingMode);
        }
    }

}
