<?php
	global $path;
?>

<link href="<?php echo $path; ?>Modules/muc/Lib/style.css" rel="stylesheet">
<script type="text/javascript" src="<?php echo $path; ?>Lib/tablejs/table.js"></script>
<script type="text/javascript" src="<?php echo $path; ?>Lib/tablejs/custom-table-fields.js"></script>
<script type="text/javascript" src="<?php echo $path; ?>Modules/muc/Lib/muc-table-fields.js"></script>
<script type="text/javascript" src="<?php echo $path; ?>Modules/muc/Lib/config/config.js"></script>
<script type="text/javascript" src="<?php echo $path; ?>Modules/muc/Views/device/device.js"></script>
<script type="text/javascript" src="<?php echo $path; ?>Modules/muc/Views/channel/channel.js"></script>

<style>
	#table input[type="text"] {
		width: 88%;
	}
	#table td:nth-of-type(1) { width:14px; text-align: center; }
	#table td:nth-of-type(2) { width:10%; }
	#table td:nth-of-type(3) { width:5%; }
	#table td:nth-of-type(4) { width:10%; }
	#table td:nth-of-type(5) { width:10%; }
	#table td:nth-of-type(6), th:nth-of-type(6) { text-align: right; }
	#table td:nth-of-type(7), th:nth-of-type(7) { width:15%; text-align: right; }
	#table td:nth-of-type(8) { width:14px; text-align: center; }
	#table td:nth-of-type(9) { width:14px; text-align: center; }
	#table td:nth-of-type(10) { width:14px; text-align: center; }
	#table th[fieldg="flag"] { font-weight:normal; text-align: right; }
	#table th[fieldg="state"] { font-weight:normal; text-align: right; }
	#table th[fieldg="dummy-8"] { width:14px; text-align: center; }
	#table th[fieldg="dummy-9"] { width:14px; text-align: center; }
	#table th[fieldg="dummy-10"] { width:14px; text-align: center; }
</style>

<div>
	<div id="api-help-header" style="float:right;"><a href="api"><?php echo _('Channels API Help'); ?></a></div>
	<div id="local-header"><h2><?php echo _('Channels'); ?></h2></div>

	<div id="table"><div align='center'></div></div>

	<div id="channel-none" class="hide">
		<div class="alert alert-block">
			<h4 class="alert-heading"><?php echo _('No channels'); ?></h4><br>
			<p>
				<?php echo _('Channels are used to configure e.g. different registers of metering units.'); ?>
				<br><br>
				<?php echo _('Several channels may be registered for a device, imlementing the communication to corresponding metering units (see the devices tab).'); ?>
				<br>
				<?php echo _('You may want the next link as a guide for generating your request: '); ?><a href="api"><?php echo _('Channel API helper'); ?></a>
			</p>
		</div>
	</div>

	<div id="toolbar-bottom"><hr>
		<a id="device-return" class="btn btn-small" href="<?php echo $path; ?>muc/device/view"><i class="icon-chevron-left" ></i>&nbsp;<?php echo _('Devices'); ?></a>
		<button id="channel-new" class="btn btn-primary btn-small" >&nbsp;<i class="icon-plus-sign icon-white" ></i>&nbsp;<?php echo _('New channel'); ?></button>
		<button id="channel-scan" class="btn btn-info btn-small" >&nbsp;<i class="icon-search icon-white" ></i>&nbsp;<?php echo _('Scan channels'); ?></button>
	</div>
	
	<div id="channel-loader" class="ajax-loader"></div>
</div>

<?php require "Modules/muc/Views/channel/dialog/add.php"; ?>
<?php require "Modules/muc/Views/channel/dialog/scan.php"; ?>
<?php require "Modules/muc/Views/channel/dialog/config.php"; ?>
<?php require "Modules/muc/Views/channel/dialog/write.php"; ?>
<?php require "Modules/muc/Views/channel/dialog/delete.php"; ?>

<?php require "Modules/process/Views/process_ui.php"; ?>

<script>
	var path = "<?php echo $path; ?>";
	
	// Extend table library field types
	for (z in muctablefields) table.fieldtypes[z] = muctablefields[z];
	for (z in customtablefields) table.fieldtypes[z] = customtablefields[z];
	table.element = "#table";
	table.groupprefix = 'Device ';
	table.groupby = 'deviceid';
	table.groupfields = {
		'dummy-4':{'title':'', 'type':"blank"},
		'dummy-5':{'title':'', 'type':"blank"},
		'flag':{'title':'<?php echo _('Flag'); ?>', 'type':"group-state"},
		'state':{'title':'<?php echo _('State'); ?>', 'type':"group-state"},
		'dummy-8':{'title':'', 'type':"blank"},
		'dummy-9':{'title':'', 'type':"blank"},
		'dummy-10':{'title':'', 'type':"blank"}
	}
	
	table.deletedata = false;
	table.fields = {
		'disabled':{'title':'', 'type':"disable"},
		'deviceid':{'title':'<?php echo _("Device"); ?>','type':"text"},
		'nodeid':{'title':'<?php echo _("Node"); ?>','type':"text"},
		'id':{'title':'<?php echo _("Name"); ?>','type':"text"},
		'description':{'title':'<?php echo _('Description'); ?>','type':"text"},
		'flag':{'title':'<?php echo _("Flag"); ?>', 'type':"state"},
		'state':{'title':'<?php echo _("State"); ?>', 'type':"state"},
		// Actions
// 		'edit-action':{'title':'', 'type':"edit"},
		'delete-action':{'title':'', 'type':"delete"},
		'write-action':{'title':'', 'type':"icon-enabled", 'icon':'icon-edit'},
		'config-action':{'title':'', 'type':"iconconfig", 'icon':'icon-wrench'}
	}

	update();

	channel.states = null;
	function update() {
		
		var requestTime = (new Date()).getTime();
		$.ajax({ url: path+"muc/channel/list.json", dataType: 'json', async: true, success: function(data, textStatus, xhr) {
			table.timeServerLocalOffset = requestTime-(new Date(xhr.getResponseHeader('Date'))).getTime(); // Offset in ms from local to server time
			table.data = data;

			table.draw();
			if (table.data.length != 0) {
				$("#channel-none").hide();
				$("#local-header").show();
			} else {
				$("#channel-none").show();
				$("#local-header").hide();
			}
			$('#channel-loader').hide();
		}});
	}

	var updater;
	function updaterStart(func, interval) {
		
		clearInterval(updater);
		updater = null;
		if (interval > 0) updater = setInterval(func, interval);
	}
	updaterStart(update, 5000);

	// Process list UI js
	processlist_ui.init(0); // Set input context

	$("#table").bind("onEdit", function(e) {
		
		updaterStart(update, 0);
	});

	$("#table").bind("onDisable", function(e,id,row,disable) {
		
		$('#channel-loader').show();

		// Get device of clicked row
		var channelSelection = table.data[row];
		var result = channel.update(channelSelection['ctrlid'], channelSelection['nodeid'], 
				channelSelection['id'], channelSelection['description'], channelSelection);
		
		if (!result.success) {
			alert('Unable to update channel:\n'+result.message);
			return false;
		}
		update();
	});

	$("#table").bind("onResume", function(e) {
		
		updaterStart(update, 5000);
	});

	$("#table").bind("onDelete", function(e,id,row) {
		
		// Get channel of clicked row
		var channelSelection = table.data[row];
		
		channelDeleteDialog.load(channelSelection, row);
	});

	$("#table").on('click', '.icon-wrench', function() {
		
		// Get driver of clicked row
		var channelSelection = table.data[$(this).attr('row')];

		channelConfigDialog.load(channelSelection, false);
	});

	$("#table").on('click', '.icon-edit', function() {
		
		// Get driver of clicked row
		var channelSelection = table.data[$(this).attr('row')];

		channelWriteDialog.load(channelSelection);
	});

	$("#channel-new").on('click', function () {
		
		channelAddDialog.load(null);
	});

	$("#channel-scan").on('click', function () {
		
		channelScanDialog.load(null);
	});
</script>