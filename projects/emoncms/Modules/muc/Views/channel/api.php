<?php global $path, $session, $user; ?>
<style>
  a.anchor{display: block; position: relative; top: -50px; visibility: hidden;}
</style>

<h2><?php echo _('Channel API'); ?></h2>
<h3><?php echo _('Apikey authentication'); ?></h3>
<p><?php echo _('If you want to call any of the following actions when you\'re not logged in you have this options to authenticate with the API key:'); ?></p>
<ul><li><?php echo _('Append on the URL of your request: &apikey=APIKEY'); ?></li>
<li><?php echo _('Use POST parameter: "apikey=APIKEY"'); ?></li>
<li><?php echo _('Add the HTTP header: "Authorization: Bearer APIKEY"'); ?></li></ul>
<p><b><?php echo _('Read only:'); ?></b><br>
<input type="text" style="width:255px" readonly="readonly" value="<?php echo $user->get_apikey_read($session['userid']); ?>" />
</p>
<p><b><?php echo _('Read & Write:'); ?></b><br>
<input type="text" style="width:255px" readonly="readonly" value="<?php echo $user->get_apikey_write($session['userid']); ?>" />
</p>

<h3><?php echo _('Available HTML URLs'); ?></h3>
<table class="table">
    <tr><td><?php echo _('The channel list view'); ?></td><td><a href="<?php echo $path; ?>muc/channel/view"><?php echo $path; ?>muc/channel/view</a></td></tr>
    <tr><td><?php echo _('This page'); ?></td><td><a href="<?php echo $path; ?>muc/channel/api"><?php echo $path; ?>muc/channel/api</a></td></tr>
</table>

<h3><?php echo _('Available JSON commands'); ?></h3>
<p><?php echo _('To use the json api the request url needs to include <b>.json</b>'); ?></p>

<p><b><?php echo _('Channel actions'); ?></b></p>
<table class="table">
	<tr><td><?php echo _('Create new channel'); ?></td><td><a href="<?php echo $path; ?>muc/channel/create.json?ctrlid=1&deviceid=Home&configs={%22id%22:%22Power%22,%22nodeid%22:%22Home%22}"><?php echo $path; ?>muc/channel/create.json?ctrlid=1&deviceid=Home&configs={"id":"Power","nodeid":"Home"}</a></td></tr>
	<tr><td><?php echo _('List channels'); ?></td><td><a href="<?php echo $path; ?>muc/channel/list.json"><?php echo $path; ?>muc/channel/list.json</a></td></tr>
	<tr><td><?php echo _('List channel states'); ?></td><td><a href="<?php echo $path; ?>muc/channel/states.json"><?php echo $path; ?>muc/channel/states.json</a></td></tr>
	<tr><td><?php echo _('Get channel information'); ?></td><td><a href="<?php echo $path; ?>muc/channel/info.json?ctrlid=1&driverid=csv"><?php echo $path; ?>muc/channel/info.json?ctrlid=1&driverid=csv</a></td></tr>
	<tr><td><?php echo _('Get channel details'); ?></td><td><a href="<?php echo $path; ?>muc/channel/get.json?ctrlid=1&id=Power"><?php echo $path; ?>muc/channel/get.json?ctrlid=1&id=Power</a></td></tr>
	<tr><td><?php echo _('Set latest channel value'); ?></td><td><a href="<?php echo $path; ?>muc/channel/set.json?ctrlid=1&id=Switch&value=false&valueType=boolean"><?php echo $path; ?>muc/channel/set.json?ctrlid=1&id=Switch&value=false&valueType=boolean</a></td></tr>
	<tr><td><?php echo _('Write value to channel'); ?></td><td><a href="<?php echo $path; ?>muc/channel/write.json?ctrlid=1&id=Switch&value=false&valueType=boolean"><?php echo $path; ?>muc/channel/write.json?ctrlid=1&id=Switch&value=false&valueType=boolean</a></td></tr>
	<tr><td><?php echo _('Update channel configuration'); ?></td><td><a href="<?php echo $path; ?>muc/channel/update.json?ctrlid=1&id=Power&configs={%22id%22:%22Power%22,%22nodeid%22:%22Home%22,%22disabled%22:%22true%22}"><?php echo $path; ?>muc/channel/update.json?ctrlid=1&id=Power&configs={"id":"Power","nodeid":"Home","disabled":"true"}</a></td></tr>
	<tr><td><?php echo _('Delete existing channel'); ?></td><td><a href="<?php echo $path; ?>muc/channel/delete.json?ctrlid=1&id=Power"><?php echo $path; ?>muc/channel/delete.json?ctrlid=1&id=Power</a></td></tr>
</table>

<p><b><?php echo _('Channel scan actions'); ?></b></p>
<table class="table">
	<tr><td><?php echo _('Start scan for channels'); ?></td><td><a href="<?php echo $path; ?>muc/channel/scan/list.json?ctrlid=1&device=Foo&settings=%22%22"><?php echo $path; ?>muc/channel/scan/list.json?ctrlid=1&device=Foo&settings=""</a></td></tr>
</table>
