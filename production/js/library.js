(function($){
	var $actions = {
		// define default helper function pattern
		// that will be recycled for simple css
		// property change actions
		helper : function(self,prop,event) {
			var $this = self;
			var $value = $this.val();
			var $target = event.data.target;
			if( event.data.args != undefined && event.data.args.unit != undefined ) {
				$value = $value + event.data.args.unit;
				$value = $value.toString();
			}
			$($target).css(prop,$value);	
		},
		colorChange: {
			name: 'colorChange',
			trigger: 'change',
			action: function(event){
				$actions.helper($(this),'color',event);
			}
		},
		backgroundChange: {
			name: 'backgroundChange',
			trigger: 'change',
			action: function(event){
				$actions.helper($(this),'background',event);
			}
		},
		textSize: {
			name: 'textSize',
			trigger: 'change',
			action: function(event){
				$actions.helper($(this),'font-size',event);
			}
		},
		customCSS: {
			name: 'customCSS',
			trigger: 'change',
			action: function(event){
				var $css = event.data.args;
				$actions.helper($(this),$css,event);
			}
		},
		toggleClass: {
			name: 'toggleClass',
			trigger: 'click',
			action: function(event){ 
				var $this = $(this);
				var $target = event.data.target;
				var $cls = event.data.args;
				$($target).toggleClass($cls);
			}
		},
		switchClass: {
			name: 'switchClass',
			trigger: 'click',
			action: function(event){
				var $this = $(this);
				var $target = event.data.target;
				var $classes = event.data.args;
				var $cls = $this.val();
				if( !$($target).hasClass($cls) ) 
					$($target)
						.removeClass($classes)
						.addClass($cls);
			}
		},
	}
	styleswitch.include($actions);
})(jQuery);