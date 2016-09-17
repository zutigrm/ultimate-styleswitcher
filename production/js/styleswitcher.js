/*
* Ultimate Styleswitch Framework
*
* @Version: 1.0.0
* @Author: Aleksej
* @Author URL: http://themeflection.com
*
* Licence: GPL2
*
*/
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        root.styleswitch = factory(root.jQuery);
    }
}(this, function ($) {

	var $resized;

	function Styleswitch(){
		this.init();
	}

	Styleswitch.prototype.init = function(){
		this.define();
		this.style();
		this.panels();
		this.setActions();
		var $stw = this.$stw; 
		this.$stw.on('click', '#tf-switch', {stw: $stw}, this.switcherHandle);
		$(window).on( 'resize', {stw: $stw}, this.responsive );
	}

	Styleswitch.prototype.afterInit = function(){
		var $panels = this.$stw.find('.tf-panel');
		var $panelActive = this.$stw.find('.tf-panel.active');
		//check for checked selectBox fields
		checked();
		// initialize colorPicker
		styleswitch.colorPickerInit();
		// run the actions
		// initialize colorPicker
		styleswitch.actions();
		// add scroller container, inner container and
		// switcher control button
		var $button = this.$style.button;
		this.$stw.wrapInner('<div class="tf-scroller" />');
		this.$stw.wrapInner('<div id="styleswitcher-inner" />');
		this.$stw.append('<a id="tf-switch">'+$button+'</div>');
		// apply styles to switcher
		applyStyles(this.$stw,this.$style);
		// close switcher
		this.switcherHandle();
		// call responsive check
		this.responsive(this.$stw);
		// regulate panels
		$panels.css('display', 'none');
		$panelActive.css('display', 'block');
	}

	Styleswitch.prototype.define = function(){
		var $self = this;
		this.$style = {};
		this.$stw = $('#styleswitch');
		this.$actionEls = {};
		this.$html = {
			section: '<div class="tf-section">',
			panel: '<div class="tf-panel">',
			panelClose: '</div>',
			group: '<div class="tf-group" />',
			labelOpen: '<label>',
			labelClose: '</label>',
			select: function(id){ return '<select id="'+id+'">' },
			option: function(val,txt,def){ return '<option value="'+val+'" '+(def ? 'selected="selected"' : '')+'>'+txt+'</option>' },
			color: function(id,def){ return '<input id="'+id+'" type="text" value="'+def+'" class="tf-color" />' },
			selectBox: function(style,text){ return '<label class="tf-select"><span '+style+'>'+text+'</span>' },
			selectBoxInner: function(nam,val,def){ return '<input type="radio" name="'+nam+'" value="'+val+'" '+(def ? 'checked="checked"' : '')+' />' },
			selectBoxClose: '</label>',
			number: function(id,def){ return '<input id="'+id+'" type="number" value="'+def+'" />' },
			text: function(id,plc,def){ return '<input id="'+id+'" type="text" value="'+def+'" '+(plc ? 'placeholder="'+plc+'"' : '')+' />' },
			colorPalette: function(name,vals){ return $self.dynamicField('skins', name, vals); }
		}
	}

	Styleswitch.prototype.style = function(options){
		var $defaults = {
			direction: 'right',
			top: '4em',
			width: 280,
			height: 500,
			background: '#3f3f3f',
			color: '#ddd',
			button: '<i class="fa fa-cog fa-spin fa-2x"></i>'
		}

		this.$style = $.extend( {}, $defaults, options );
	}

	function applyStyles(switcher,ops){
		var $direction = ops.direction;
		var $top = ops.top;
		var $width = ops.width;
		var $height = ops.height;
		var $scrollerHeight = $height - parseInt(switcher.css('padding-top'),10) - parseInt(switcher.css('padding-bottom'),10);
		var $background = ops.background;
		var $color = ops.color;
		var $button = ops.button;
		if( $direction === 'right' ) {
			switcher.addClass('right');
		}
		switcher.css({
			top: $top,
			width: $width,
			maxHeight: $height,
			background: $background,
			color: $color
		});
		switcher.find('.tf-scroller').css('max-height', $scrollerHeight);
	}

	Styleswitch.prototype.responsive = function(e) {
		var $time = 10;
		if( typeof e.data == 'function' ) {
			var $stw = e;
			$time = 450;
		} else var $stw = e.data.stw; 
		var $top = parseInt( $stw.css('top'),10 );
		var $curHeight = $stw.outerHeight() + $top; 
		var $hgh = $(window).height() - $top;
		$stw.css('height',$hgh); 
		var $diff = parseInt( $stw.css('padding-bottom'), 10 )+parseInt( $stw.css('padding-bottom'), 10 );
		if( $curHeight >= $(window).height() ) {  
			setTimeout(function(){
				$stw.find('.tf-scroller').css('max-height', $hgh-$diff); 
			},$time)
			 
			$resized = true;
		} else if( $curHeight <= $(window).height() && $resized === true ){ 
			$stw.css('height', '');
			$resized = false;
			$hg = parseInt( $stw.css('max-height'), 10 ) - (parseInt( $stw.css('padding-bottom'), 10 )+parseInt( $stw.css('padding-bottom'), 10 ));
			if( $hg > $(window).height() ) $hg = $hgh-$diff; 
			$stw.find('.tf-scroller').css('max-height', $hg);
		}
	}

	// Styleswitcher Open/Close handle function
	Styleswitch.prototype.switcherHandle = function(e) {
		var $switcher = e != undefined ? e.data.stw : this.$stw;
		var $direction = $switcher.hasClass('right') ? 'right' : 'left';
		var $width = $switcher.outerWidth();
		var $this = e != undefined ? $(this) : $switcher.find('#tf-switch');
		if( !$this.hasClass('active') ) open();
		else close();

		if( e === undefined ) close();

		function open(){
			$this.addClass('active');
			if( $direction === 'right' ) $switcher.animate({right: 0},320);
			else $switcher.animate({left: 0},320);
		}

		function close(){
			$this.removeClass('active');
			if( $direction === 'right' ) $switcher.animate({right: -$width},320);
			else $switcher.animate({left: -$width},320);
		}
	}

	Styleswitch.prototype.panels = function(){
		var $self = this.$stw;

		function init(){
			$self.on('click', '.tf-title', slide);
			$self.on('click', '.tf-select', opSelect);
		}
		
		function slide(){
			var $this = $(this);
			var $panel = $(this).parent().find('.tf-panel');
			if( $panel.hasClass('active') ){
				Up($panel);
			} else {
				Down($panel);
			}
		}
		
		function Up(el) {
			var $panel = el;
			$panel.removeClass('active');
			$panel.slideUp(320);
		}
		
		function Down(el){
			var $panel = el;
			$panel.addClass('active');
			$panel.slideDown(320);
		}

		init();
	}

	// declare notification that will be used as
	// global function
	Styleswitch.prototype.notification = function(notification,timeout){
		var $notf = '<div class="tf-notify"><span>'+notification+'</span></div>';
		$('body').prepend($notf);
		$notf = $('.tf-notify');
		$notf.animate({opacity: 1},320);
		setTimeout(function(){
			$notf.fadeOut(300,'linear',function(){
				$notf.remove();
			});
		},timeout);
	}

	// collect all the actions and then define them
	// as listeners with callback functions
	Styleswitch.prototype.actions = function(args){
		var $actions = this.$actions; 
		var $els = this.$actionEls;
		var $self = this.$stw;
		$.each( $els, function(key,value){
			if( typeof $actions[value.action] == 'undefined' ) {
			 	console.warn('Styleswitcher ERROR: Non existent action assigned to the field: '+ value.element+'. Action: '+value.action+' has not been created yet. Read in documentation about addAction() method.' );
			 	return false;
			}
			var $target = value.target;
			var $element = $actions[value.action]['element'] ? $actions[value.action]['element'] : value.element;
			var $trigger = $actions[value.action]['trigger'];
			var $actionName = $actions[value.action];
			var $action = $actionName.action;
			var $args = value.args ? value.args : ''; 
			// define the listener
			$self.on($trigger,$element,{target: $target, args: $args},$action);
		});
	}

	Styleswitch.prototype.addAction = function(args){
		this.$actions[args.name] = args; 
	}

	Styleswitch.prototype.addNewField = function(args){
		this.$html[args.name] = args.callback;
	}

	// Define default actions that will be available
	// for usage.
	Styleswitch.prototype.setActions = function(){
		// Main actions object where all
		// actions are stored
		var $actions = {}
		this.$actions = $actions;
	}

	// define include method which will be
	// be used for adding actions and fields
	// libraries
	Styleswitch.prototype.include = function(library,type){
		if( typeof library != 'object' ) {
		 	console.warn('Styleswitcher ERROR: Library must be added as an object, non object was passed to the styleswitch.include() method. Library is of type: '+( typeof library ) );
		 	return false;
		}
		if( !type || type === 'actions' ) this.$actions = library;
		if( type === 'fields' ) this.$html = $.extend({}, library, this.$html);
	}

	function opSelect() {
        var $this = $(this);
        $this.addClass('active').siblings().removeClass('active');
        $this.find('input').attr('checked', 'checked');
        $this.siblings().find('input').removeAttr('checked');
        var id = $this.find('input').data('id');
        if( id ) {
           $(id).css('display', 'inline-block');
           $('label[data-id="'+id+'-not"').css('display', 'none');
        }
      }

      function checked() {
      	$('.tf-select').each(function(){
      		var $this = $(this);
          	var id = $this.find('input').data('id');
          	if( id ) $(id).css('display', 'none');
      	}); 
        $('#styleswitch').find('input[checked="checked"]').each(function(){ 
            var id = $(this).data('id');
            $(this).parent().addClass('active').siblings().removeClass('active');
            if( $(this).parent().prop('tagName') === 'SPAN' ) $(this).closest('label').addClass('active').siblings().removeClass('active');
            if( id ) $(id).css('display', 'inline-block');
        });
      }

	Styleswitch.prototype.dynamicField = function(type, name, vals) {
		var $html = '';
		if( type === 'skins' ) {
			var n = 0;
			$.each( vals, function(key,val){
				var $title = val.name ? val.name : '';
				var $color = val.color ? val.color : '';
				var $id = name ? name+'-'+n : ''; 
				var $path = val.path ? val.path : '';
				var $def = val.default ? 'checked="checked"' : '';
				$html += '<label id="'+$id+'" class="tf-select" title ="'+$title+'"><span style="background:'+$color+'"></span>';
				$html += '<input data-url="'+$path+'" type="radio" name="'+name+'[]" '+$def+' />';
				$html += '</label>';
				n++;
			});
		}

		return $html;
	}

	// sort values and format html
	// for selectBox field type
	function selectBoxFormat(self,val,name) {
		var vals = {};
		var $style = val.img ? 'style="background: url('+val.img+') no-repeat; background-size: 100% 100%;' : 'style="width: auto;';
		var $text = val.text ? val.text : '';
		var $def = val.default ? val.default : '';
		var $value = val.value ? val.value : ''; 
		if( name.indexOf('[]') != -1 ) name = name.replace('[]', '');
		var $name = name+'[]';
		if( val.width ) $style += 'width:'+val.width+'px;';
		if( val.height ) $style += 'height:'+val.height+'px;line-height:'+val.height+'px;';
		if( val.bg ) $style += 'background:'+val.bg+';';
		$style += '"';
	 	var openTag = self.$html.selectBox($style,$text);
	 	var $html = openTag;
	 	$html += self.$html.selectBoxInner($name, $value, $def);
	 	$html += self.$html.selectBoxClose;

		return $html;
	}

	// format and return the field's html output
	function formatField(self, field, args) {
		var $html = '';
		var $self = self;
		var $args = args.args ? args.args : '';
		var $label = args.label ? args.label : '';
		var $def = args.default ? args.default : '';
		var $name = args.name ? args.name : '';
		var $desc = args.desc ? '<small class="tf-desc">'+args.desc+'</small>' : '';
		var $id = args.id ? args.id : '';
		var $title = args.fieldTitle ? args.fieldTitle : '';
		var $txt = args.text ? args.text : '';
		var $target = args.target ? args.target : '';
		var $action = args.action ? args.action : '';
		var $actionArgs = args.actionArgs ? args.actionArgs : '';
		var $placeholder = args.placeholder ? args.placeholder : '';
		var $el = $id ? $id : $name;
		// check field type, so if additional
		// attributes are needed - edit them now
		// before sending it for final formating
		switch( field ) {
			case 'text':
			 $html = self.$html.text($id, $placeholder, $def);
			break;
			case 'selectBox':
			 var ops = args.options;
			 $.each( ops, function(key,val){
				$html += selectBoxFormat(self,val,$name);
			 });
			break;
			case 'select':
			 var ops = args.options ? args.options : {};
			 $html = self.$html.select($id);
			 $.each( ops, function(key,val){
			 	var $text = val.text ? val.text : '';
			 	var $val = val.value ? val.value : '';
			 	var $def = val.default ? 'selected="selected"' : ''; 
				$html += self.$html.option($val,$text,$def);
			 });
			 $html += '</select>';
			break;
			case 'colorPalette':
			var $colors = args.colors ? args.colors : {}; 
			 $html = self.$html.colorPalette($name, $colors);
			break;
			case 'number':
			 $html = self.$html.number($id, $def);
			break;
			case 'color':
			 $html = self.$html.color($id, $def);
			break;
			default: 
			 if( typeof self.$html[field] == 'undefined' ) {
			 	console.warn('Styleswitcher ERROR: Undefined field called, check if the field called exists. Called Field Name: '+field+'. Read in documentation about addField() method.');
			 	return false;
			 }
			 else if( typeof self.$html[field]['callback'] == 'function' ) $custom = self.$html[field]['callback'];
			 else if( typeof self.$html[field] == 'function' ) $custom = self.$html[field];
			 $html = $custom($id,$def,$args);
			break;
		}
		if( !$id && $name ) $id = 'input[name="'+$name+'[]"]';
		else if( $id ) $id = '#'+$id; 
	 	if( $target || $action ) $self.$actionEls[$el] = {target: $target, element: $id, action: $action, args: $actionArgs}
		if( $label && !$title ) $html = $self.$html.labelOpen + $label + $html + $desc + $self.$html.labelClose;
		else if( $title ) $html = '<h5>'+ $title + '</h5>' + $html + $desc;

		return $html;
	}

	Styleswitch.prototype.addField = function(field, args, isReturned){
		var $self = this;
		var $html = '';
		var $val = formatField($self, field, args);
		if( $val != undefined )	$html = $val;
		else $html = '<span style="color: indianred">This field type ('+field+') does not exists.</span>';
		if( $val == undefined ) $html += '<small class="tf-desc">'+args.desc+'</small>';
		if( !isReturned ) this.$stw.append($html);		
		else return $html;
	}

	// groupate field into group
	Styleswitch.prototype.addGroup = function(args,multi){
		var $self = this.$stw; 
		var $field = args.field ? args.field : '';
		var $icon = args.icon ? '<i class="'+args.icon+'"></i>' : '';
		var $title = args.title ? '<h4>'+$icon+args.title+'</h4>' : '';
		var $groupTitle = args.groupTitle ? '<h5>'+args.groupTitle+'</h5>' : '';
		var $group = args.group ? args.group : '';
		var $val = '';
		var $result = this.$html.group;
		if( !$group ) {
			$val = this.addField($field, args, true);
			$val = '<div class="tf-group">'+$val+'</div>';
		} else {
			var $this = this;
			var $desc = args.desc ? '<small class="tf-desc">'+args.desc+'</small>' : '';
			$.each( $group,function(key,val){
				$field = val.field;
				$val += '<div class="tf-group">';
				$val += $this.addField($field, val, true); 
				$val += '</div>';
			});
			$val = '<div class="tf-grouped">'+$groupTitle+$val+$desc+'</div>';
		}
		var $html = $($result)
						.append($title)
						.append($val);
		if( !multi ) 
			$html.appendTo($self);
		else 
			return $html.html();
	}

	function groupFields(self, fields) {
		var $html = '';
		var $self = self;
		$.each( fields, function(key,val){
			$html += $self.addGroup(val,true);
		});

		return $html;
	}

	Styleswitch.prototype.addOptions = function(args,notDone){
		var $html = '';
		var $self = this;
		$.each( args, function(key,value){
			var $title = value.title;
			var $icon = value.icon ? '<i class="'+value.icon+'"></i>' : '';
			var $fields = value.fields;
			var $panel = value.panel ? value.panel : '';
			var $active = value.active ? value.active : '';
			$html += $self.$html.section;
			$html += '<h4 class="tf-title">'+$icon+$title+'</h4>';
			if( $panel && $active ) $html += $self.$html.panel.replace('tf-panel', 'tf-panel active');
			else if( $panel ) $html += $self.$html.panel;
			$html += groupFields($self, $fields);
			if( $panel ) $html += $self.$html.panelClose;
			$html += '</div>';
		});
		
		this.$stw.append($html);
		if( !notDone ) this.afterInit();
	}

	Styleswitch.prototype.colorPickerInit = function() {
		   // initialize spectrum
		  $('.tf-color').spectrum({
		    showAlpha: true,
		    showInitial: true,
		    showPalette: true,
		    allowEmpty:true,
		      showSelectionPalette: true,
		      maxPaletteSize: 10,
		    palette: [
		        ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
		        "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
		        ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
		        "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
		        ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
		        "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
		        "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
		        "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
		        "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
		        "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
		        "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
		        "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
		        "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
		        "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
		      ]
		  });
	}

	// let's get going :)
	return new Styleswitch();

}));