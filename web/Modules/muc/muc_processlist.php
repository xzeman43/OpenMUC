<?php
/*
 All Emoncms code is released under the GNU Affero General Public License.
 See COPYRIGHT.txt and LICENSE.txt.
 ---------------------------------------------------------------------
 Emoncms - open source energy visualisation
 Part of the OpenEnergyMonitor project: http://openenergymonitor.org
 */

// no direct access
defined('EMONCMS_EXEC') or die('Restricted access');

class Muc_ProcessList
{
    private $mysqli;
    private $redis;
    private $feed;
    private $channel;

    private $log;

    // Module required constructor, receives parent as reference
    public function __construct(&$parent)
    {
        $this->mysqli = &$parent->mysqli;
        $this->redis = &$parent->redis;
        $this->feed = &$parent->feed;
        
        require_once "Modules/muc/muc_model.php";
        $ctrl = new Controller($this->mysqli, $this->redis);
        
        require_once "Modules/muc/Models/channel_model.php";
        $this->channel = new Channel($ctrl, $this->mysqli, $this->redis);
        
        $this->log = new EmonLogger(__FILE__);
    }

    // Module required process configuration, return $list array
    public function process_list()
    {
        $list = array();
        
        // 0=>Name | 1=>Arg type | 2=>function | 3=>No. of datafields if creating feed | 4=>Datatype | 5=>Group | 6=>Engines | 'requireredis'=>true | 'desc'=>Description
        $list[] = array(_("Time derivative by seconds"),ProcessArg::FEEDID,"derivative_s",1,DataType::REALTIME,"Misc",array(Engine::PHPFIWA,Engine::PHPFINA,Engine::PHPTIMESERIES), 'requireredis'=>true, 'desc'=>"<p>Get the derivative of the value with respect to the time in seconds.</p>");
        $list[] = array(_("Time derivative by hours"),ProcessArg::FEEDID,"derivative_h",1,DataType::REALTIME,"Misc",array(Engine::PHPFIWA,Engine::PHPFINA,Engine::PHPTIMESERIES), 'requireredis'=>true, 'desc'=>"<p>Get the derivative of the value with respect to the time in hours.</p>");
        return $list;
    }
    
    public function derivative_s($feedid, $time, $value)
    {
        return $this->derivative($feedid, $time, $value, 1);
    }
    
    public function derivative_h($feedid, $time, $value)
    {
        return $this->derivative($feedid, $time, $value, 1/3600);
    }
    
    private function derivative($feedid, $time, $value, $scale)
    {
        global $redis;
        if (!$redis|| $value === null) return $value; // return if redis is not available or null
        
        $derivative = 0;
        if ($redis->exists("process:derivative:$feedid")) {
            $lastvalue = $redis->hmget("process:derivative:$feedid",array('time','value'));
            $delta_value = $value - $lastvalue['value'];
            $delta_time = ($time - $lastvalue['time'])*$scale;
            if ($delta_time > 0) {
                $derivative = $delta_value / $delta_time;
            }
            $this->feed->insert_data($feedid, $time, $time, $derivative);
        }
        $redis->hMset("process:derivative:$feedid", array('time' => $time, 'value' => $value));
        
        return $derivative;
    }

//     public function write_channel($arg, $time, $value)
//     {
//         global $redis;
//
//         $config = array();
//         foreach(explode(";", $arg) as $parameter) {
//             list($key, $val) = explode('=', str_replace('"', '', $parameter));
//             $config[$key] = $val;
//         }
//
//         if (isset($config['ctrlid']) && isset($config['name']) && isset($config['value'])) {
//    
//             $ctrlid = (int) $config['ctrlid'];
//             $name = $config['name'];
//             $writevalue = $config['value'];
//
//             if ($redis && $redis->exists("process:writechannel:$name")) {
//                 $lastvalue = $redis->hmget("process:writechannel:$name", array('time','value'));
//
//                 if ($writevalue === $lastvalue['value']) {
//                     $redis->hMset("process:writechannel:$name", array('time' => $time, 'value' => $writevalue));
//                     $this->log->info('Skipped writing to channel "'.$name.'": '.$writevalue);
//
//                     return $value;
//                 }
//             }
//             $this->channel->write($ctrlid, $name, $writevalue, $config['valueType']);
//
//             $redis->hMset("process:writechannel:$name", array('time' => $time, 'value' => $writevalue));
//             $this->log->info('Wrote value to channel "'.$name.'": '.$writevalue);
//         }
//
//         return $value;
//     }

}
