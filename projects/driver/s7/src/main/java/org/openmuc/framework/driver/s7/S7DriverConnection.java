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
import org.openmuc.framework.data.BooleanValue;
import org.openmuc.framework.data.Flag;
import org.openmuc.framework.data.IntValue;
import org.openmuc.framework.data.Record;
import org.openmuc.framework.driver.DriverDevice;
import org.openmuc.framework.driver.annotation.*;
import org.openmuc.framework.driver.s7.lib.*;
import org.openmuc.framework.driver.spi.ConnectionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.ByteBuffer;
import java.text.SimpleDateFormat;
import java.util.BitSet;
import java.util.Date;
import java.util.List;

import static org.openmuc.framework.config.option.annotation.OptionType.ADDRESS;
import static org.openmuc.framework.config.option.annotation.OptionType.SETTING;

@Device(channel = S7Channel.class)
public class S7DriverConnection extends DriverDevice {
    private static final Logger logger = LoggerFactory.getLogger(S7DriverConnection.class);


    @Option(type = ADDRESS,
            name = "Server address",
            description = "The address to the S7 server.")
    protected String address;

    @Option(type = SETTING,
            id = "rack",
            name="Rack position",
            description="The default rack position on the remote device.",
            mandatory = false)
    private int rack = 1;

    @Option(type = SETTING,
            id = "slot",
            name="Slot position",
            description="The default slot on the remote device.",
            mandatory = false)
    private int slot = 1;

    @Option(type = SETTING,
            id = "ct",
            name="Connection type",
            description="Type of the connection. PG=1, OP=2, S7 Basic=3. Default is PG",
            mandatory = false)
    private int conType = 1;

    private int namespaceIndex = 0;

    private static final boolean MakeAllTests = true;

    private static long Elapsed;
    private static byte[] Buffer = new byte[65536]; // 64K buffer (maximum for S7400 systems)
    private final S7Client Client = new S7Client();
    private static int ok=0;
    private static int ko=0;
    private static String IpAddress = "192.168.50.101";
    private static int Rack = 0; // Default 0 for S7300
    private static int Slot = 1; // Default 2 for S7300
    private static int DBSample = 1; // Sample DB that must be present in the CPU
    private static int DataToMove; // Data size to read/write
    private static int CurrentStatus = S7.S7CpuStatusUnknown;

    public static void HexDump(byte[] Buffer, int Size)
    {
        int r=0;
        String Hex = "";

        for (int i=0; i<Size; i++)
        {
            int v = (Buffer[i] & 0x0FF);
            String hv = Integer.toHexString(v);

            if (hv.length()==1)
                hv="0"+hv+" ";
            else
                hv=hv+" ";

            Hex=Hex+hv;

            r++;
            if (r==16)
            {
                System.out.print(Hex+" ");
                System.out.println(S7.GetPrintableStringAt(Buffer, i-15, 16));
                Hex="";
                r=0;
            }
        }
        int L=Hex.length();
        if (L>0)
        {
            while (Hex.length()<49)
                Hex=Hex+" ";
            System.out.print(Hex);
            System.out.println(S7.GetPrintableStringAt(Buffer, Size-r, r));
        }
        else
            System.out.println();
    }

    public boolean Connect()
    {
        if(conType == 3){
            Client.SetConnectionType(S7.S7_BASIC);
        }else if( conType == 2) {
            Client.SetConnectionType(S7.OP);
        }else {
            Client.SetConnectionType(S7.PG);
        }
        int Result = Client.ConnectTo(address, rack, slot);
        logger.info("Connection result: " + Result);
        if (Result==0)
        {
            logger.info("Connected to   : " + address + " (Rack=" + rack + ", Slot=" + slot+ ")");
            System.out.println("Connected to   : " + address + " (Rack=" + rack + ", Slot=" + slot+ ")");
            logger.info("PDU negotiated : " + Client.PDULength()+" bytes");
            System.out.println("PDU negotiated : " + Client.PDULength()+" bytes");
        }
        return Result == 0;
    }

    @Connect
    public void connect() throws ConnectionException {
            logger.info("Trying to connect to S7.");
            if (Connect())
            {
//
//                MujTest();
            }else{
                throw new ConnectionException("Cannot connect to S7");
            }
    }

    @Disconnect
    public void close() {
        Client.Disconnect();
    }

    @Read
    public void read(List<S7Channel> channels, String samplingGroup)
            throws ConnectionException {
        try {
            boolean[] IQread = new boolean[20];
            boolean[] dbBoolRead= new boolean[20];
            BitSet[] Ibits = new BitSet[20];
            BitSet[] dbIBits = new BitSet[20];
            for (S7Channel channel : channels){
                int area = channel.getArea();
                if(area == 129 || area == 130) {
                    String inputPlace = channel.getPlace();
                    String[] split = inputPlace.split("\\.");
                    int bytePos = Integer.parseInt(split[0]);
                    int bitPos = Integer.parseInt(split[1]);
                    if(IQread[bytePos] == false){
                        int Result = Client.ReadArea(channel.getArea(), DBSample, bytePos, 1, Buffer);
                        if (Result == 0){
                            IQread[bytePos]= true;
                            Ibits[bytePos] = BitSet.valueOf(new byte[] {Buffer[bytePos]});
                            channel.setRecord(new Record(new BooleanValue(Ibits[bytePos].get(bitPos)), System.currentTimeMillis()));
                        }
                    }else{
                        channel.setRecord(new Record(new BooleanValue(Ibits[bytePos].get(bitPos)), System.currentTimeMillis()));
                    }

                }
                if(area==132){
                    String inputPlace = channel.getPlace();
                    String[] split = inputPlace.split("\\.");
                    int bytePos = Integer.parseInt(split[0]);
                    if(split.length > 1) {
                        int bitPos = Integer.parseInt(split[1]);
                        if(dbBoolRead[bytePos] == false) {
                            int Result = Client.ReadArea(channel.getArea(), channel.getDbNum(), bytePos, 1, Buffer);
                            if (Result == 0) {
                                dbBoolRead[bytePos] = true;
                                dbIBits[bytePos] = BitSet.valueOf(new byte[]{Buffer[bytePos]});
                                channel.setRecord(new Record(new BooleanValue(dbIBits[bytePos].get(bitPos)), System.currentTimeMillis()));
                            }
                        }else{
                            channel.setRecord(new Record(new BooleanValue(dbIBits[bytePos].get(bitPos)), System.currentTimeMillis()));
                        }
                    }else{
                        int length = channel.getValueLength(channel.getValueType());
                        if (length != 0) {
                            int Result = Client.ReadArea(channel.getArea(), channel.getDbNum(), bytePos, length, Buffer);
                            if (Result == 0) {
                                byte[] res = new byte[4];
                                System.arraycopy(Buffer, bytePos, res, 0, length);
                                ByteBuffer byteBuffer = ByteBuffer.wrap(res);
                                int resik =0;
                                if(length == 2){
                                    short s = byteBuffer.getShort();
                                    resik = 0xFFFF & s;
                                }else {
                                    resik = byteBuffer.getInt();
                                }
                                channel.setRecord(new Record(new IntValue(resik), System.currentTimeMillis()));
                            }
                        }
                    }
                }
            }

        } catch ( NullPointerException e) {
            logger.warn("Reading data from OPC server failed. {}", e);
            throw new ConnectionException(e);
        }
    }

    @Write
    public void write(List<S7Channel> channels)
            throws ConnectionException {
        try {
            boolean[] IQread = new boolean[20];
            boolean[] dbBoolRead = new boolean[20];
            BitSet[] Ibits = new BitSet[20];
            BitSet[] dbIBits = new BitSet[20];
            for (S7Channel channel : channels) {
                int area = channel.getArea();
                if (area == 129 || area == 130) {
                    String inputPlace = channel.getPlace();
                    String[] split = inputPlace.split("\\.");
                    int bytePos = Integer.parseInt(split[0]);
                    int bitPos = Integer.parseInt(split[1]);
                    if (channel.getRecord().getValue().asBoolean() == false) {
                        if (dbIBits[bytePos].get(bitPos)) {
                            dbIBits[bytePos].clear(bitPos);
                            byte[] array = dbIBits[bytePos].toByteArray();
                            if (array.length < 1){
                                array = new byte[]{0};
                            }
                            System.arraycopy(array, bytePos, Buffer, bytePos, 1);
                            int Result = Client.WriteArea(channel.getArea(), channel.getDbNum(), bytePos, 1, Buffer);
                            if (Result == 0) {
                                channel.setFlag(Flag.VALID);
                                logger.info("Sucessfully written! " + channel.getRecord().getValue());
                            }
                        }
                    } else {
                        dbIBits[bytePos].set(bitPos, true);
                        System.arraycopy(dbIBits[bytePos].toByteArray(), bytePos, Buffer, bytePos, 1);
                        int Result = Client.WriteArea(channel.getArea(), channel.getDbNum(), bytePos, 1, Buffer);
                        if (Result == 0) {
                            channel.setFlag(Flag.VALID);
                            logger.info("Sucessfully written! " + channel.getRecord().getValue());
                        }
                    }

                }
                if (area == 132) {
                    String inputPlace = channel.getPlace();
                    String[] split = inputPlace.split("\\.");
                    int bytePos = Integer.parseInt(split[0]);
                    if (split.length > 1) {
                        int bitPos = Integer.parseInt(split[1]);
                        int RResult = Client.ReadArea(channel.getArea(), channel.getDbNum(), bytePos, 1, Buffer);
                        if (RResult == 0) {
                            dbBoolRead[bytePos] = true;
                            dbIBits[bytePos] = BitSet.valueOf(new byte[]{Buffer[bytePos]});

                            if (channel.getRecord().getValue().asBoolean() == false) {
                                if (dbIBits[bytePos].get(bitPos)) {
                                    dbIBits[bytePos].clear(bitPos);
                                    byte[] array = dbIBits[bytePos].toByteArray();
                                    if (array.length < 1){
                                        array = new byte[]{0};
                                    }
                                    System.arraycopy(array, bytePos, Buffer, bytePos, 1);
                                    int Result = Client.WriteArea(channel.getArea(), channel.getDbNum(), bytePos, 1, Buffer);
                                    if (Result == 0) {
                                        channel.setFlag(Flag.VALID);
                                        logger.info("Sucessfully written! " + channel.getRecord().getValue());
                                    }
                                }
                            } else {
                                dbIBits[bytePos].set(bitPos, true);
                                System.arraycopy(dbIBits[bytePos].toByteArray(), bytePos, Buffer, bytePos, 1);
                                int Result = Client.WriteArea(channel.getArea(), channel.getDbNum(), bytePos, 1, Buffer);
                                if (Result == 0) {
                                    channel.setFlag(Flag.VALID);
                                    logger.info("Sucessfully written! " + channel.getRecord().getValue());
                                }
                            }
                        }
                    } else {
                        int length = channel.getValueLength(channel.getValueType());
                        if (length != 0) {
                            byte[] valueB = channel.getRecord().getValue().asByteArray();
                            System.arraycopy(valueB, 0, Buffer, bytePos, length);
                            int Result = Client.WriteArea(channel.getArea(), channel.getDbNum(), bytePos, length, Buffer);
                            if (Result == 0) {
                                channel.setFlag(Flag.VALID);
                                logger.info("Sucessfully written! " + channel.getRecord().getValue());

                            }
                        }
                    }
                }
            }
        }catch ( NullPointerException e) {
            logger.warn("Writing data from OPC server failed. {}", e);
            throw new ConnectionException(e);
        }
    }

}
