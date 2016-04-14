var AutoTagging = {
	'current_element': undefined,
	'editing_mode': false,
	'elements': "div:not(.element_submenu),img,p,span,h1,h2,h3,h3,h4,h5",
	'turn_off_all_anchors': function() {
		$('a:not(.auttag_btn)').click(function(e) {
			alert("All external links are disabled in this automatic-tagging window, sorry. \n\n - Team Mahalo")
			e.preventDefault();
			return false;
		})
	},
	'init': function() {
		AutoTagging.turn_off_all_anchors();
		AutoTagging.attach_mouseovers();
		AutoTagging.init_menu();
	},
	'init_menu': function() {

		$('#raw_element_submenu').mouseover(function() {
			AutoTagging.editing_mode = true;
			AutoTagging.handle_mini_description();
		});

		$('#raw_element_submenu').mouseout(function() {
			AutoTagging.editing_mode = false
			$(AutoTagging.current_element).removeClass('hover'); // TODO refactor ME
		});

		$('#editable_button').click(function() {

			AutoTagging.assign_class_for_current('tag-edit')

			AutoTagging.menu.show_buttons_for('editable')
			AutoTagging.add_to_current_unique_uid()
			//	alert('editable')
		})

		$('#clear_button').click(function() {

  		   AutoTagging.current_element.removeClass('tag-edit')

			AutoTagging.menu.show_buttons_for('clear')
			
			//		alert('clear')
		})

		$('#advanced_checkbox').click(function() {
			var current_value = $(this).is(':checked')

			if (current_value == true) {
				$('#advanced_options_select').show()
				$('#shared_checkbox, #shared_label').show()
			} else {
				$('#advanced_options_select').hide();
				$('#shared_checkbox').prop('checked', false).hide();
				$('#shared_label').hide();

				$('#advanced_options_select').val("SELECT");

				var current_jquery_element = AutoTagging.current_element;
				AutoTagging.current_element.removeClass('tag-repeat').removeClass('tag-navigation')
				var shared_id = AutoTagging.current_element.attr('class').match(/tag-shared-\d+/)
				if (shared_id == null) {} else {
					$(AutoTagging.current_element).removeClass(shared_id);
				}

				$(AutoTagging.current_element).addClass('tag-edit');

			}

			// TODO: Implement server side
		})

		$('#shared_checkbox').click(function() {
			var current_jquery_element = AutoTagging.current_element;
			var current_value = $(this).is(':checked')

			if (current_value) {
				$('#shared_input').show()
			} else {

				$('#shared_input').val("").hide()
				$('#shared_checkbox').prop('checked', false)

				var shared_id = current_jquery_element.attr('class').match(/tag-shared-\d+/)
			
				if(shared_id == null) {} else {
					
				   $(AutoTagging.current_element).removeClass(shared_id )
			   }

			}
		})

		$('#shared_input').blur(function() {
			var shared_input = $('#shared_input').val();

			if (shared_input == "") {
				alert("Shared class name cannot be empty!")
			} else {
				var current_jquery_element = AutoTagging.current_element;
				var shared_id = current_jquery_element.attr('class').match(/tag-shared-\d+/)
				AutoTagging.current_element.removeClass(shared_id) // remove previous shared if exist
				AutoTagging.current_element.addClass('tag-shared-' + shared_input)
			}

		})


		// TODO Refactor
		$('#advanced_options_select').change(function() {
			var selected_option = $(this).val()
			switch (selected_option) {
			case "EDIT_AND_REPEAT":
				AutoTagging.assign_class_for_current('tag-repeat')
				AutoTagging.assign_class_for_current('tag-edit')
				AutoTagging.current_element.removeClass('tag-navigation')

				$("#shared_label, #shared_checkbox").show()
				$('#shared_checkbox').is(':checked') ? $('#shared_input').show() : $('#shared_input').hide();

				break;
			case "REPEAT":
				AutoTagging.assign_class_for_current('tag-repeat')
				AutoTagging.current_element.removeClass('tag-edit')
				AutoTagging.current_element.removeClass('tag-navigation')

				$("#shared_label, #shared_checkbox").show()
				$('#shared_checkbox').is(':checked') ? $('#shared_input').show() : $('#shared_input').hide();
				break;
			case "PAGE_NAVIGATION":
				AutoTagging.assign_class_for_current('tag-navigation')
				AutoTagging.current_element.removeClass('tag-repeat')
				AutoTagging.current_element.removeClass('tag-edit')

				$("#shared_input").val("")
				$("#shared_checkbox").val(false)

				var shared_id = AutoTagging.current_element.attr('class').match(/tag-shared-\d+/)
				AutoTagging.current_element.removeClass(shared_id)

				$("#shared_label, #shared_checkbox, #shared_input").hide()
				break
			default:
				AutoTagging.current_element.removeClass('tag-repeat')
				AutoTagging.current_element.removeClass('tag-navigation')

				$("#shared_label, #shared_checkbox, #shared_input").hide()
				alert("Your element have initial status now (only 'tag-edit' class)")
			}
		})


	},
	'assign_class_for_current': function(class_name) {
		AutoTagging.current_element.addClass(class_name)
	},
	'add_to_current_unique_uid': function() {
		if (!AutoTagging.current_element.attr('id')) {
			var unique_uid = Randomizer.unique_id();
			AutoTagging.current_element.attr('id', unique_uid)
		}
	},
	'handle_mini_description': function() {
		AutoTagging.position_mini_description();
		AutoTagging.notify_mini_description();
	},
	'handle_raw_submenu': function() {
		var jquery_element = AutoTagging.current_element;
		var my_position = jquery_element.position();
		var my_width = jquery_element.width();
		var my_height = jquery_element.height();

		var fluid_position = (my_position.top - 30 > 0) ? my_position.top - 30 : my_position.top + my_height + 10;

		$("#raw_element_submenu").css('left', my_position.left).css('top', fluid_position).show();


		if (jquery_element.hasClass('tag-edit')) {
			if (jquery_element.hasClass('tag-repeat')) {
				AutoTagging.menu.show_buttons_for('editable_repeatable')
			} else {
				AutoTagging.menu.show_buttons_for('editable')
			}
		} else if (jquery_element.hasClass('tag-repeat')) {
			AutoTagging.menu.show_buttons_for('repeatable')
		} else if (jquery_element.hasClass('tag-navigation')) {
			AutoTagging.menu.show_buttons_for('navigateable')
		} else {
			AutoTagging.menu.show_buttons_for('clear')
		}
	},
	menu: {
		show_buttons_for: function(type) {

			var current_jquery_element = AutoTagging.current_element;

			var shared_id = current_jquery_element.attr('class').match(/tag-shared-\d+/)
         
			if (shared_id == null) {
				$("#shared_checkbox").prop('checked', false)
				$("#shared_input").val("").hide()
			} else {
				$("#shared_checkbox").show()
				$("#shared_checkbox").prop('checked', true)
				var shared_input_id = (shared_id + "").replace('tag-shared-', '');
				$("#shared_input").val(shared_input_id).show()
			}


			if (type == 'editable') {

				$("#editable_button").hide();
				$("#clear_button").show();

				$("#advanced_checkbox").show()
				$("#advanced_label").show()
				if ($("#advanced_checkbox").is(':checked')) {
					$("#advanced_options_select").val("DEFAULT").show()
					$("#shared_label").show()
					$("#shared_checkbox").show()
				}

			} else if (type == 'editable_repeatable') {
				$("#editable_button").hide();
				$("#clear_button").show();
				$("#advanced_checkbox").prop('checked', true).show()
				$("#advanced_label").show()
				$("#advanced_options_select").val("EDIT_AND_REPEAT").show()

				$("#shared_label").show()
				$("#shared_checkbox").show()

			} else if (type == 'navigateable') {
				$("#editable_button").show();
				$("#clear_button").hide();
				$("#advanced_checkbox").prop('checked', true).show()
				$("#advanced_options_select").val("PAGE_NAVIGATION").show()
				$("#advanced_label").show();

				$("#shared_label").hide()
				$("#shared_checkbox").hide()
				$("#shared_input").hide()

			} else if (type == 'repeatable') {
				$("#editable_button").show();
				$("#clear_button").hide();
				$("#advanced_checkbox").prop('checked', true).show()
				$("#advanced_options_select").val("REPEAT").show()
				$("#advanced_label").show();

				$("#shared_label").show()
				$("#shared_checkbox").show()

			} else if (type == 'clear') {
				$("#editable_button").show();
				$("#clear_button").hide()
				$("#advanced_checkbox").hide()
				$("#advanced_label").hide()
				$("#advanced_options_select").val("DEFAULT").hide()

	//			$("#shared_input, #shared_checkbox, #shared_label").hide()
			}


		}
	},
	'position_mini_description': function() {
		var jquery_element = AutoTagging.current_element;
		var my_position = jquery_element.position();
		var my_width = jquery_element.width();
		var my_height = jquery_element.height();

		$("#mini_description").css('left', my_position.left).css('top', my_position.top + my_height).stop(true, true).show()


		$(AutoTagging.current_element).addClass('hover'); // TODO refactor ME
	},
	'notify_mini_description': function() {
		var jquery_element = AutoTagging.current_element;

		class_if_element = (jquery_element.hasClass("")) ? undefined : jquery_element.attr('class').replace('hover', '')

		var id_of_element = jquery_element.attr('id');
		var element_tag_name = jquery_element[0].tagName.toLowerCase();
		var src_section = (element_tag_name != "img") ? "" : ("src=\"" + jquery_element.attr('src') + "\" ")

		var string_to_display = "<" + element_tag_name + " " + src_section + ((class_if_element == undefined) ? "" : ("class=\"" + class_if_element + "\"")) + " id=\"" + ((id_of_element == undefined) ? "" : id_of_element) + "\"" + " >";
		$("#mini_description").text(string_to_display);
	},
	'attach_mouseovers': function() {
		$(AutoTagging.elements).mouseover(function(e) {

			if (!AutoTagging.editing_mode) {
				var element = $(this);
				AutoTagging.current_element = element;

				AutoTagging.handle_mini_description();
				AutoTagging.handle_raw_submenu();


				e.stopPropagation();
				return false;
			}

		});

		$(AutoTagging.elements).mouseout(function(e) {

			if (!AutoTagging.editing_mode) {

				$(this).removeClass('hover');
				$("#mini_description").stop(true, true).hide();
			}

		})

	}
}

var Randomizer = {
	'unique_id': function() {
		//	alert("IMPLEMENT ME")
		return "AA27"
	}
}
