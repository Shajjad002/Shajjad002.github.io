$(document).ready(function(){
	$(document).on('click','.modal_close',function(){
		$('.modal-backdrop').remove();
	});
	$(document).on('click','.view_notices',function(){
		var id  = $(this).data('id');
		$.post('api/user.php',{view_notice : id},function(data){
			var response = JSON.parse(data);
			$('.load_notice_details').html(response.message);
			$('.page_sections').addClass('display_none');
			$('#notice_details').removeClass('display_none');
		});
	});
	//digital shop service start
	
	$(document).on('click','.copytext',function(){
	   var elm = document.getElementById("copyarea");
	  // for Internet Explorer
	  if(document.body.createTextRange) {
		var range = document.body.createTextRange();
		range.moveToElementText(elm);
		range.select();
		document.execCommand("Copy");
		alert("Copied div content to clipboard");
	  }
	  else if(window.getSelection) {
		  // other browsers
		var selection = window.getSelection();
		var range = document.createRange();
		range.selectNodeContents(elm);
		selection.removeAllRanges();
		selection.addRange(range);
		document.execCommand("Copy");
		//alert("Copied");
	  }
	  $(".copytext").html('Copied');
	  $(".copytext").addClass('btn btn-success');
	 });
	$(document).on('click','.load_more',function(){
		var thisbtn = $(this);
		var type = $(thisbtn).data('type');
		var bid = $(thisbtn).data('bid');
		var lid = $(thisbtn).data('lid');
		var cid = $(thisbtn).data('cid');
		var lastid = $(thisbtn).data('lastid');
		$.post('api/dshop',{load_more : type,lastid :lastid,bid:bid,lid:lid,cid:cid},function(data){
			var response = JSON.parse(data);
			$('#'+type).append(response.products);
			$(thisbtn).data('lastid',response.newlastid);
		});
	});
	$(document).on('click','.dshop_view_product',function(){
		var id  = $(this).data('id');
		$.post('api/dshop.php',{dshop_view_product : id},function(data){
			var response = JSON.parse(data);
			$('.dshop_load_product').html(response.message);
			$('.page_sections').addClass('display_none');
			$('#dshop_viewproduct').removeClass('display_none');
		});
	});
	$(document).on('click','.shop_action_btn',function(){
		var action = $(this).data('action');
		var id = $(this).data('id');
		var curier_info = $('.curier_info').val();
		var cancel_reason = $('.cancel_reason').val();
		 //alert(curier_info);
		$.post('api/dshop.php',{action:action,id:id,curier_info:curier_info,cancel_reason:cancel_reason},function(data){
			var response  = JSON.parse(data);
			if(response.success == 1){
			 //  alert(data);
				$('.shop_action_error').html('<div class="alert alert-success">'+response.message+'</div>');
				window.setTimeout(function(){
					// Move to a new location or you can do something else
					window.location.reload();
				}, 2000);
			}else{
				$('.shop_action_error').html('<div class="alert alert-danger">'+response.message+'</div>');
			}
		});
	});
	$(document).on('click','.dshop_edit_product',function(){
		var id  = $(this).data('id');
		$.post('api/dshop.php',{dshop_edit_product : id},function(data){
			var response = JSON.parse(data);
			$('.dshop_load_product').html(response.message);
			$('.page_sections').addClass('display_none');
			$('#dshop_viewproduct').removeClass('display_none');
		});
	});
	$(document).on('click','.accept_shop_btn',function(){
		var thisbtn = $(this);
		var value = thisbtn.attr('rev');
		thisbtn.addClass('clickdisable');
		$.post('api/dshop.php',{accept_shop : value},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.accept_shop_error').html('<div class="alert alert-success">'+response.message+'</div>');
				setTimeout(function(){
				  window.location.href = 'index';
				}, 3000);
			}else{
				$('.accept_shop_error').html('<div class="alert alert-danger">'+response.message+'</div>');
				thisbtn.removeClass('clickdisable');
		
			}
		});
	});
	$(document).on('click','.view_shoppingdetails',function(){
		var value = $(this).attr('value');
		$.post('api/user_details.php',{view_shoppingdetails : value},function(data){
			$('.load_shoppingdetails').empty();
			$('.load_shoppingdetails').html(data);
		});
	});
	
	//
	$(document).on('click','.remove_cart',function(){
	    var cartid = $(this).attr('rev');
	    $.post('api/dshop.php',{remove_cart:cartid},function(data){
	        var response = JSON.parse(data);
	        $('.cart_noti').html(response.message);
			$('.cart_noti_two').html(response.message);
			$('.load_income_total').html(response.incometotal);
			$('.load_cart_total').html(response.bagtotal);
			$('.delivery_charge_val').attr('value',response.dcharge);
			
	    });
	    $(this).closest(".pro-item").remove();
	});
	
	
	//
	$(document).on('click','.order_address_proceed',function(){
		var order_name = $('.order_name').val();
		var order_location = $('.order_location').val();
		var order_address = $('.order_address').val();
		var order_locality = $('.order_locality').val();
		var order_contact = $('.order_contact').val();
		$.post('api/dshop.php',{
			order_name:order_name,
			order_location:order_location,
			order_address:order_address,
			order_locality:order_locality,
			order_contact:order_contact,
			
			},function(data){
				var response = JSON.parse(data);
				if(response.success == 1){
					$('.page_sections').addClass('display_none');
					$('#p_payment').removeClass('display_none');
					$('.load_delivery_address').html(order_address);
					$('#p_payment').empty();
					$.post('imports/p_payment.php',function(data){
						$('#p_payment').html(data);
					});
					
				}else{
					$('.order_address_error').html('<div class="alert alert-danger" >'+response.message+'</div>');
				}
				
		});
		
	});
	//
	$(document).on('click','.payment_confirm_btn',function(){
		var shop_name = $('.invoice_shop_name').val();
		$.post('api/dshop.php',{
			confirm_dshop_order:shop_name,
			
			},function(data){
				var response = JSON.parse(data);
				if(response.success == 1){
					$('.page_sections').addClass('display_none');
					$('#dshop_complete').empty();
					$.post('imports/dshop_complete.php',function(data){
						$('#dshop_complete').html(data);
					});
					$('#dshop_complete').removeClass('display_none');
				}else{
					$('.order_complete_error').html('<div class="alert alert-danger" >'+response.message+'</div>');
				}
				
		});
	});
	$(document).on('click','.login_alert',function(){
	    $('.addtocartalert').html('<div class="alert alert-info animated fadeIn " ><div class="on-call"><div class="modal fade show" id="oncall2" tabindex="-1" role="dialog" aria-labelledby="oncallLabel" style="display: block;"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close modal_close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div><div class="modal-body text-center"><div class="mb-5"><img src="img/login.png" alt=""></div><div class="mt-5 support-body-text text-center pt-1"><h4>অনুগ্রহ করে একাউন্ট এ লগইন করুন</h4><p>সেবা টি উপভোগ করতে আপনার একাউন্ট এ লগইন করুন </p></div></div></div></div></div></div><div class="modal-backdrop fade show"></div></div>');
				  
	});
	//
	$(document).on('click','.addtocartbtn',function(){
		var id = $(this).attr('rev');
		$.post('api/dshop.php',{cart : id},function(data){
			var response = JSON.parse(data);
			$('.cart_noti').html(response.message);
			$('.cart_noti_two').html(response.message);
			$('.load_cart_product').append(response.cartproduct);
			$('.load_income_total').html(response.incometotal);
			$('.load_cart_total').html(response.bagtotal);
			
				  $('.addtocartalert').html('<div class="alert alert-info animated fadeIn " >Added To Cart</div>');
				  	
		
		    $('.page_sections').addClass('display_none');
			$('#p_shop').removeClass('display_none');
		});
	});
	
	
	
	//
	$(document).on('click','.cart_plus',function(){
		var pid = $(this).attr('rev');
		$.post('api/dshop.php',{cart_plus : pid},function(data){
			var response = JSON.parse(data);
			$('.load_single_total_'+pid).html(response.singletotal);
			$('.load_single_income_'+pid).html(response.singleincometotal);
			$('.load_cart_total').html(response.bagtotal);
			$('.load_income_total').html(response.incometotal);
			$('.cart_qnty_'+pid).html(response.newqnty);
			$('.delivery_charge_val').attr('value',response.dcharge);
		});
	});
	
	$(document).on('click','.clearcart',function(){
		$.post('api/dshop.php',{cleardepocart:1});
	});
	 $(document).on('keyup','.s_sale_price',function(){
	   var max  = $(this).data('max');
	   var min  = $(this).data('min');
	   var pid  = $(this).data('pid');
	   var value = $(this).val();
	   //alert(value);
	   
	   if(max >= value){
		   if(min <= value){
			   $('.s_sale_price_error_'+pid).empty();
			   $.post('api/dshop.php',{sale_price_pid:pid,sale_price_value:value},function(data){
				   var response = JSON.parse(data);
				   
				   $('.load_single_income_'+pid).html(response.message.income);
				   $('.load_income_total').html(response.message.income_total);
				   $('.load_cart_total').html(response.message.bag_total);
			   });
		   }else{
			   $('.s_sale_price_error_'+pid).html('<div class="alert alert-danger">You can set sell price from '+min+' to '+max+' only</div>');
		   }
	   }else{
		   $('.s_sale_price_error_'+pid).html('<div class="alert alert-danger">You can set sell price from '+min+' to '+max+' only</div>');
	   }
   });
	//
	$(document).on('click','.cart_minus',function(){
		var pid = $(this).attr('rev');
		$.post('api/dshop.php',{cart_minus : pid},function(data){
			var response = JSON.parse(data);
			$('.load_single_total_'+pid).html(response.singletotal);
			$('.load_single_income_'+pid).html(response.singleincometotal);
			$('.load_cart_total').html(response.bagtotal);
			$('.load_income_total').html(response.incometotal);
			$('.cart_qnty_'+pid).html(response.newqnty);
			$('.delivery_charge_val').attr('value',response.dcharge);
		});
	});
	//
	$(document).on('click','.product_details',function(){
		var pid = $(this).attr('value');
		$.post('api/dshop.php',{load_product:pid},function(data){
			$('.load_product').empty();
			var response = JSON.parse(data);
			$('.load_product').html(response.message);
		});
	});
	//
	
	$(document).on('click','.cat_products',function(){
		var cid = $(this).attr('value');
		$.post('api/dshop.php',{load_cat_product:cid},function(data){
			$('.load_cat_product').empty();
			var response = JSON.parse(data);
			$('.load_cat_product').html(response.message);
		});
	});
	$(document).on('click','.brand_products',function(){
		var bid = $(this).data('bid');
		$.post('api/dshop.php',{load_brand_product:bid},function(data){
			$('.load_cat_product').empty();
			var response = JSON.parse(data);
			$('.load_cat_product').html(response.message);
		});
	});
	$(document).on('click','.local_products',function(){
		var bid = $(this).data('lid');
		$.post('api/dshop.php',{load_local_product:bid},function(data){
			$('.load_cat_product').empty();
			var response = JSON.parse(data);
			$('.load_cat_product').html(response.message);
		});
	});
	//
	$(document).on('submit','#dshop_activation_form',function(e) {
		$('.submit_btn').attr('style','pointer-events:none;');
		var url = "api/dshop.php"; // the script where you handle the form input.
			$.ajax({
			   type: "POST",
			   url: url,
			   data: $("#dshop_activation_form").serialize(), // serializes the form's elements.
			   success: function(data)
			   {
				var response = JSON.parse(data);
				if(response.success == 1){
					if(response.message.redirect == 1){
						$('.dshop_activation_form').html('<div class="alert alert-success animated fadeIn">Processing</div>');
						setTimeout(function(){
							window.location.href = response.message.url;
						}, 1000);
					}else{
						$('.dshop_activation_form').html('<div class="alert alert-success animated fadeIn">'+response.message+'</div>');
						setTimeout(function(){
							window.location.href = 'index';
						}, 5000);
					}
				}else{
					$('.submit_btn').attr('style','pointer-events:auto;');
					$('.dshop_activation_form').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
				}
			   }
			 });
		e.preventDefault(); // avoid to execute the actual submit of the form.
	});
	
	
	//digital shop service end
	
	
	
	// tutor service
	$(document).on('click','.send_tutor_message',function(){
		var id = $(this).data('id');
		var msgtext = $('.tutor_message_text_'+id).val();
		$.post('api/tutor.php',{send_tutor_message:id,msgtext:msgtext},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.tutor_msg_error_'+id).html('<div class="alert alert-success">'+response.message+'</div>');
				setTimeout(function(){
					window.location.href = 'index';
				}, 1000);
			}else{
				$('.tutor_msg_error_'+id).html('<div class="alert alert-danger">'+response.message+'</div>');
			}
		});
	});
	$(document).on('submit','#tu_activation_form',function(e) {
		$('.submit_btn').attr('style','pointer-events:none;');
		var url = "api/tutor.php"; // the script where you handle the form input.
			$.ajax({
			   type: "POST",
			   url: url,
			   data: $("#tu_activation_form").serialize(), // serializes the form's elements.
			   success: function(data)
			   {
				var response = JSON.parse(data);
				if(response.success == 1){
					if(response.message.redirect == 1){
						$('.tu_activation_form').html('<div class="alert alert-success animated fadeIn">Processing</div>');
						setTimeout(function(){
							window.location.href = response.message.url;
						}, 1000);
					}else{
						$('.tu_activation_form').html('<div class="alert alert-success animated fadeIn">'+response.message+'</div>');
						setTimeout(function(){
							window.location.href = 'index';
						}, 3000);
					}
				}else{
					$('.submit_btn').attr('style','pointer-events:auto;');
					$('.tu_activation_form').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
				}
			   }
			 });
		e.preventDefault(); // avoid to execute the actual submit of the form.
	});
	$(document).on('submit','#tutor_search_form',function(e) {
		$('.submit_btn').attr('style','pointer-events:none;');
		var url = "api/tutor.php"; // the script where you handle the form input.
			$.ajax({
			   type: "POST",
			   url: url,
			   data: $("#tutor_search_form").serialize(), // serializes the form's elements.
			   success: function(data)
			   {
				var response = JSON.parse(data);
				if(response.success == 1){
					$('.load_tutors').html(response.message);
					$('.page_sections').addClass('display_none');
					$('#tu_tutordetails').removeClass('display_none');
				}else{
					$('.submit_btn').attr('style','pointer-events:auto;');
					$('.tutor_search_form').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
				}
			   }
			 });
		e.preventDefault(); // avoid to execute the actual submit of the form.
	});
	
	// tutor  service end
		//bus api start

	$(document).on('submit','#busticket_userinfo_form',function(e) {
	   $('.preloader').show();
		
	   var url = "api/busticket.php"; // the script where you handle the form input.
		$.ajax({
			   type: "POST",
			   url: url,
			   data: $("#busticket_userinfo_form").serialize(), // serializes the form's elements.
			   success: function(data)
			   {
				//alert(data); 
				var response = JSON.parse(data);
				$('.preloader').hide();
		
				if(response.success == 1){
					$('.page_sections').addClass('display_none');
					$('.load_busticket_preview').html(response.message);
					$('#b_busreview').removeClass('display_none');
				}else{
					$('.busticket_userinfo_form').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
				}
			   }
			 });
		e.preventDefault(); // avoid to execute the actual submit of the form.
	});
		$(document).on('click','.view_bustickethistory',function(){
		var id = $(this).attr('value');
		$.post('api/user_details.php',{view_bustickethistory : id},function(data){
			$('.load_bustickethistorydetails').empty();
			$('.load_bustickethistorydetails').html(data);
		});
	});
	$(document).on('click','.busticket_purchase_proceed',function(){
		var tnc_check = $('.tnc_checkbox');
		if($(tnc_check).prop("checked") == true){
		
		
		$('.preloader').show();
		$.post('api/busticket.php',{proceed_to_busticket_pay:1},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.bus_confirm_error').html('<div class="alert alert-success">'+response.message+'</div>');
				window.setTimeout(function(){
					// Move to a new location or you can do something else
					window.location.reload();
				}, 2000);
			}else{
				$('.bus_confirm_error').html('<div class="alert alert-danger">'+response.message+'</div>');
				
			}
			$('.preloader').hide();
		
		});
		}else{
			$('.bus_confirm_error').html('<div class="alert alert-danger">Must accept our terms and conditions</div>');
			$('.preloader').hide();
		}
	});
	$(document).on('click','.proceed_to_busticketform',function(){
		var boarding_options = $('.boarding_options').val();
		$('.preloader').show();
		$.post('api/busticket.php',{boarding_options : boarding_options},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.page_sections').addClass('display_none');
				$('.load_bus_ticket_form').html(response.message);
				$('#b_busticketform').removeClass('display_none');
			}else{
				$('.busticket_proceed_error').html('<div class="alert alert-danger">'+response.message+'</div>');
			}
			$('.preloader').hide();
		
		});
	});
	$(document).on('click','.seat_box',function(){
		var seats = $(this).attr('rev');
		var thisclass = $(this);
		//alert(seats);
		$.post('api/busticket.php',{seat_select : seats},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
			    //alert("aaaaaa");
				$(thisclass).toggleClass('selected');
				$('.load_seat_numbers').html(response.message.seat_no);
				$('.load_total_price').html(response.message.total_price);
			}
		});
	});
	$(document).on('click','.search_busschedule',function(){
		var fromplace = $('.busticket_fromplace').val();
		var toplace = $('.busticket_toplace').val();
		var fromdate = $('.busticket_fromdate').val();
		$('.preloader').show();
		$('.city_schedule_alert').html('<div class="alert alert-danger animated fadeIn">Loading schedules please wait...</div>');
		$.post('api/busticket.php',{fromplace:fromplace,toplace:toplace,fromdate:fromdate},function(data){
			$('.busticket_citiesname').html(fromplace+' - '+toplace);
			$('.busticket_depurturedate').html(fromdate);
			$('.page_sections').addClass('display_none');
			$('#b_bussearch').removeClass('display_none');
			var response = JSON.parse(data);
			$('.preloader').hide();
		
			if(response.success = 1){
				$('.load_bus_schedules').html(response.message);
				$('.city_schedule_alert').empty();
		
			}else{
				$('.city_schedule_alert').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
			//alert(data);
		});
	});
	
	$(document).on('click','.select_bus_schedule',function(){
		var schedule = $(this).data('schedule');
		$('.preloader').show();
		$.post('api/busticket.php',{schedule : schedule},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.load_boardingplan').html(response.message);
				
			}else{
				$('.load_boardingplan').html('<div class="alert alert-danger">'+response.message+'</div>');
			}
			$('.preloader').hide();
			$('.page_sections').addClass('display_none');
			$('#b_busseat').removeClass('display_none');
		});
	});
	$(document).on('click','.get_cities',function(){
		$('.city_loading_alert').html('<div class="alert alert-danger animated fadeIn">Loading cities please wait...</div>');
		$('.busticket_city_form').addClass('display_none');
		$('.city_search_preloader').removeClass('display_none');
		$.post('api/busticket.php',{get_cities:1},function(data){
			var response = JSON.parse(data);
			$('.load_bus_cities').html(response.message);
			$('.city_loading_alert').html('<div class="alert alert-success animated fadeIn">Cities Loaded</div>');
			window.setTimeout(function(){
					// Move to a new location or you can do something else
				$('.busticket_city_form').removeClass('display_none');
				$('.city_search_preloader').addClass('display_none');
			}, 1000);
		});
	});
	//bus api end
	
	$(document).on('click','.view_team_members',function(){
		var value = $(this).attr('rev');
		$.post('api/user.php',{view_team_members:value},function(data){
			var response = JSON.parse(data);
			$('.page_sections').addClass('display_none');
			$('#loadteam').removeClass('display_none');
			$('.load_teams').html(response.message);
		});
	});
	$(document).on('click','.reg_form_show',function(){
		$('.login_form_part').hide();
		$('.reg_form_part').show();
		$('.forgot_form_part').hide();
		$('.forgot_form_otp_part').hide();
		$('.vendor_form_part').hide();
	});
	$(document).on('click','.link',function(){
		var pageid = $(this).attr('rev');
		if($('#'+pageid).hasClass('import_page')){
			$('#'+pageid).empty();
			$.post('imports/'+pageid+'.php',function(data){
				$('#'+pageid).html(data);
				$("[rev=dshop_index]").attr('rev','index');
	
			});
		}
		
	});
	
	//transfer start
	$(document).on('click','.givefund',function(){
		var number = $(this).data('number');
		var name = $(this).data('name');
		var id = $(this).data('id');
		$('.load_fundtaker_name').html(name);
		$('.load_fundtaker_number').html(number);
		$('.load_fundtaker_id').val(id);
	});
	$(document).on('submit','.trptouser_form',function(e){
		var thisform = $(this);
		$('.submit_btn').attr('style','pointer-events:none;');
		var url = "api/transfer.php"; // the script where you handle the form input.
		$.ajax({
		   type: "POST",
		   url: url,
		   data: $(thisform).serialize(), // serializes the form's elements.
		   success: function(data)
		   {
			
			var response = JSON.parse(data);
				
			if(response.success == 1){
				$('.load_trview').html(response.message);
				$('.page_sections').addClass('display_none');
				$('#w_trview').removeClass('display_none');
			}else{
				$('.submit_btn').attr('style','pointer-events:auto;');
				$('.trptouser_form_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		   }
		 });
		
		e.preventDefault(); // avoid to execute the actual submit of the form.
		
	});
	$(document).on('click','.accept_transfer',function(){
		var otp = $('.transfer_otp').val();
		var thisclass = $(this);
		$(thisclass).attr('style','pointer-events:none;');
		$.post('api/transfer.php',{accept_transfer:otp},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.transfer_otp_error').html('<div class="alert alert-success">'+response.message+'</div>');
				setTimeout(function(){
					window.location.href = 'index';
				}, 5000);
			}else{
				$(thisclass).attr('style','pointer-events:auto;');
		
				$('.transfer_otp_error').html('<div class="alert alert-danger">'+response.message+'</div>');
			}
		});
	});
	//transfer end
	//rent service start
	$(document).on('click','.rent_add_service_btn',function(){
		$('.sp_reg_step_4_error').empty();
		var sl = $('.rent_sl').val();
		var name = $('.rent_ser_name').val();
		var price = $('.rent_ser_price').val();
		var charge = $('.rent_ser_charge').val();
		var description = $('.rent_ser_description').val();
		var comm = $('.rent_ser_company_comm').val();
		if(name){
			if(price){
				if(charge){
					if(description){
						if(comm){
							sl++;
							$('.rent_ser_name').val('');
							$('.rent_ser_price').val('');
							$('.rent_ser_charge').val('');
							$('.rent_ser_description').val(null);
							$('.rent_ser_company_comm').val('');
							
							$.post('api/driverreg.php',{ser_name : name,ser_price:price,ser_charge:charge,ser_description:description,comm:comm},function(){
								$('.show_service_lists').append('<span class="btn btn-success btn-sm float-left mr-2 sl_'+sl+'">'+name+' '+price+' <i class="fa fa-times-circle remove_sp_ser_session " rev="'+sl+'" ></i></span>');
							});
							//name+'_'+price+'_'+charge+'_'+description+'_'+comm
							//var store = '{"name":'+name+',"price":'+price+',"charge":'+charge+',"details":'+details+',"comm":'+comm+'}';
							var store = {name:name, price:price, description:description,charge:charge,comm:comm};
							var store = JSON.stringify(store);
							sessionStorage.setItem(sl, store);
							
							$('.rent_sl').val(sl);
							
						}else{
							$('.rent_reg_step_4_error').html('<div class="alert alert-danger">Company Commission</div>');
						}
					}else{
						$('.rent_reg_step_4_error').html('<div class="alert alert-danger">Description Required</div>');
					}
				}else{
					$('.rent_reg_step_4_error').html('<div class="alert alert-danger">Charge Required</div>');
				}
			}else{
				$('.rent_reg_step_4_error').html('<div class="alert alert-danger">Price Required</div>');
			}
		}else{
			$('.rent_reg_step_4_error').html('<div class="alert alert-danger">Name Required</div>');
		}
	});
	$(document).on('click','.accept_rent_order',function(){
		var id = $(this).attr('rev');
		$(this).addClass('clickdisable');
		$.post('api/expart.php',{accepted_provider : id},function(data){
			location.reload();
		});
	});
	$(document).on('click','.cancel_rent_order',function(){
		var id = $(this).attr('rev');
		$(this).addClass('clickdisable');
		$.post('api/expart.php',{cancel_provider : id},function(data){
			location.reload();
		});
	});
	$(document).on('click','.view_rentdetails',function(){
		var id = $(this).attr('value');
		$.post('api/rent.php',{view_exorderdetails:id},function(data){
			var response = JSON.parse(data);
			$('.load_rentdetails').html(response.message);
		});
	});
	$(document).on('click','.complete_rent_order',function(){
		var id = $(this).attr('rev');
		$(this).addClass('clickdisable');
		$.post('api/rent.php',{complited_order : id},function(data){
			//location.reload();
		});
	});
	$(document).on('click','.confirm_rent_order',function(){
		$.post('api/rent.php',{confirm_rent_order:1},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.page_sections').addClass('display_none');
				$('#r_rentorder').removeClass('display_none');
				setTimeout(function(){
					window.location.href = 'index';
				}, 5000);
			}else{
				$('.rent_confirm_form').html('<div class="alert alert-danger">'+response.message+'</div>');
			}
		});
	});
	$(document).on('click','.rent_contact_infoadd',function(){
		$('.rent_contact_person_name').html($('.rent_contact_person').val());
		$('.rent_contact_person_number').html($('.rent_contact_number').val());
		
	}); 
	$(document).on('click','.add_rent_service',function(){
		var value = $(this).attr('rev');
		$(this).toggleClass('expart_service_addes');
		$.post('api/rent.php',{add_rent_service : value},function(){
			//alert(data);
		});
	});
	$(document).on('change','.transport',function(){
		var sid = $(this).val();
		$.post('api/driverreg.php',{load_renttypes:sid},function(data){
			var response = JSON.parse(data);
			$('.load_renttypes').html(response.message);
			
		});
	});
	$(document).on('click','.view_rents',function(){
		var sid = $(this).attr('rev');
		$.post('api/rent.php',{load_rents:sid},function(data){
			var response = JSON.parse(data);
			$('.load_rents').html(response.message);
			$('.page_sections').addClass('display_none');
			$('#r_rent').removeClass('display_none');
		});
	});
	$(document).on('click','.view_rentlist',function(){
		var sid = $(this).attr('rev');
		$.post('api/rent.php',{view_rentlist:sid},function(data){
			var response = JSON.parse(data);
			$('.load_rent_type').html(response.service_type);
			$('.load_rentlist').html(response.message);
			$('.page_sections').addClass('display_none');
			$('#r_rentlist').removeClass('display_none');
		});
	});
	$(document).on('click','.get_rent_services',function(){
		var value = $(this).attr('value');
		$.post('api/rent.php',{get_rent_service : value},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.load_rent_services').html(response.message);
				$('.load_renter_info').html(response.expertinfo);
				$('.load_rent_title').html(response.exparttitle);
			}else{
				$('.load_rent_services').html('<div class="alert alert-danger col">'+response.message+'</div>');
			}
		});
	});
	$(document).on('click','.set_in_time',function(){
		
		var date = $('.rent_in_date').val();
		var time = $('.rent_in_time').val();
		$.post('api/rent.php',{schedule_date : date,schedule_time: time},function(data){
			//alert(data);
			var response = JSON.parse(data);
			$('.r_in_time').html(response.message.time);
			$('.r_in_noon').html(response.message.noon);
			$('.r_in_date').html(response.message.date);
			$('.r_in_monthyear').html(response.message.monthyear);
		});
	});
	$(document).on('click','.set_out_time',function(){
		
		var date = $('.rent_out_date').val();
		var time = $('.rent_out_time').val();
		$.post('api/rent.php',{schedule_date : date,schedule_time: time},function(data){
			//alert(data);
			var response = JSON.parse(data);
			$('.r_out_time').html(response.message.time);
			$('.r_out_noon').html(response.message.noon);
			$('.r_out_date').html(response.message.date);
			$('.r_out_monthyear').html(response.message.monthyear);
		});
	});
	
	$(document).on('submit','#driver_reg_form',function(e){
		var url = "api/driverreg.php"; // the script where you handle the form input.
		
		$.ajax({
		   type: "POST",
		   url: url,
		   data: $("#driver_reg_form").serialize(), // serializes the form's elements.
		   success: function(data)
		   {
			
			var response = JSON.parse(data);
				
			if(response.success == 1){
				$.each(sessionStorage, function(key, value){
					//$('.sp_reg_step_5_error').append(sessionStorage.getItem(key));
					$.post('api/driverreg.php',{setSession : sessionStorage.getItem(key)});
					
				});
				$('#driver_reg_form').html('<section class="congratulation"><div class="cong-details text-center"><div class="cong-thumb"><img src="img/cong.png" alt="" /></div><div class="cong-text"><h4>Congratulations!</h4><p>Your Account has been Created successfully</p><a href=""><button type="button" class="btn btn-danger">Got it!</button></a></div></div></section>');
				setTimeout(function(){
				  window.location.href = 'index';
				}, 3000);
			}else{
				$('.driver_reg_form').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		   }
		 });
		
		e.preventDefault(); // avoid to execute the actual submit of the form.
		
	});
	$(document).on('submit','#rent_order_form',function(e){
		var url = "api/rent.php"; // the script where you handle the form input.
		
		$.ajax({
		   type: "POST",
		   url: url,
		   data: $("#rent_order_form").serialize(), // serializes the form's elements.
		   success: function(data)
		   {
			
			var response = JSON.parse(data);
				
			if(response.success == 1){
				$('.rent_form_error').html('<div class="alert alert-success animated fadeIn">'+response.message+'</div>');
			}else{
				$('.rent_form_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		   }
		 });
		
		e.preventDefault(); // avoid to execute the actual submit of the form.
		
	});
	$(document).on('click','.rentschedulepreview',function(){
		$.post('api/rent.php',{check_infos:1},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.page_sections').addClass('display_none');
				$('#r_rentschedulepreview').removeClass('display_none');
				$.post('imports/r_rentschedulepreview.php',function(data){
					$('#r_rentschedulepreview').html(data);
				});
			}else{
				$('.rent_form_error').html('<div class="alert alert-danger">Please Save Your Informations First</div>');
			}
		});
	});
	//rent service end
	
	
	
	
	// fundmanagement start
	
	$(document).on('submit','#addfund_form',function(e) {
		$('.submit_btn').attr('style','pointer-events:none;');
		var url = "api/fund.php"; // the script where you handle the form input.
			$.ajax({
			   type: "POST",
			   url: url,
			   data: $("#addfund_form").serialize(), // serializes the form's elements.
			   success: function(data)
			   {
				var response = JSON.parse(data);
				if(response.success == 1){
					if(response.message.redirect == 1){
						$('.addfund_form').html('<div class="alert alert-success animated fadeIn">Processing</div>');
						setTimeout(function(){
							window.location.href = response.message.url;
						}, 1000);
					}else{
						$('.addfund_form').html('<div class="alert alert-success animated fadeIn">'+response.message+'</div>');
						setTimeout(function(){
							window.location.href = 'index';
						}, 5000);
					}
				}else{
					$('.submit_btn').attr('style','pointer-events:auto;');
					$('.addfund_form').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
				}
			   }
			 });
		e.preventDefault(); // avoid to execute the actual submit of the form.
	});
	$(document).on('submit','#withdraw_form',function(e) {
		$('.submit_btn').attr('style','pointer-events:none;');
		
		var url = "api/withdraw.php"; // the script where you handle the form input.
			$.ajax({
			   type: "POST",
			   url: url,
			   data: $("#withdraw_form").serialize(), // serializes the form's elements.
			   success: function(data)
			   {
				var response = JSON.parse(data);
				if(response.success == 1){
					$('.withdraw_form').html('<div class="alert alert-success animated fadeIn">'+response.message+'</div>');
					setTimeout(function(){
						window.location.href = 'index';
					}, 5000);
				}else{
					$('.submit_btn').attr('style','pointer-events:auto;');
		
					$('.withdraw_form').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
				}
			   }
			 });
		e.preventDefault(); // avoid to execute the actual submit of the form.
	});
	$(document).on('click','.addpoints_confirm',function(){
		$.post('api/fund.php',{addpoints_confirm : 1},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.addpoints_errors').html('<div class="alert alert-success">'+response.message+'</div>');
				setTimeout(function(){
					window.location.href = 'index';
				}, 3000);
			}else{
				$('.addpoints_errors').html('<div class="alert alert-danger">'+response.message+'</div>');
			}
		});
	});
	$(document).on('click','.withdraw_confirm',function(){
		var otp = $('.withdraw_otp').val();
		$.post('api/withdraw.php',{withdraw_otp : otp},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.withdraw_error').html('<div class="alert alert-success">'+response.message+'</div>');
				setTimeout(function(){
					window.location.href = 'index';
				}, 3000);
			}else{
				$('.withdraw_error').html('<div class="alert alert-danger">'+response.message+'</div>');
			}
		});
	});
	// fundmanagement end
	//upgrade start 
	$(document).on('click','.upg_to_business',function(){
		$('.acc_type_input').val('4');
		$('.upg_accname').html('Business');
	});
	$(document).on('submit','#upgrade_form',function(e) {
		
		var url = "api/upgrade.php"; // the script where you handle the form input.
		
		$.ajax({
		   type: "POST",
		   url: url,
		   data: $("#upgrade_form").serialize(), // serializes the form's elements.
		   success: function(data)
		   {
			
			var response = JSON.parse(data);
			
			if(response.success == 1){
				$('.page_sections').addClass('display_none');
				$('#u_upgradeview').removeClass('display_none');
				$('.upg_accname').html(response.message.accname);
				$('.upg_paytype').html(response.message.paytype);
				$('.upg_sender').html(response.message.sender);
				$('.upg_trxid').html(response.message.trxid);
			}else{
				$('.upgrade_form').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		   }
		 });
		
		e.preventDefault(); // avoid to execute the actual submit of the form.
		
	});
	$(document).on('submit','#upgrade_form_member',function(e) {
		
		var url = "api/upgrade.php"; // the script where you handle the form input.
		
		$.ajax({
		   type: "POST",
		   url: url,
		   data: $("#upgrade_form_member").serialize(), // serializes the form's elements.
		   success: function(data)
		   {
			
			var response = JSON.parse(data);
			
			if(response.success == 1){
				$('.bkash_upg').addClass('display_none');
				$('.member_upg').removeClass('display_none');
				$('.page_sections').addClass('display_none');
				$('#u_upgradeview').removeClass('display_none');
				$('.upg_member_number').html(response.message.member);
				$('.upg_sender').html(response.message.member);
				$('.upg_trxid').html(response.message.trxid);
			}else{
				$('.upgrade_form_member').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		   }
		 });
		
		e.preventDefault(); // avoid to execute the actual submit of the form.
		
	});
	$(document).on('submit','#upgrade_form_sheba',function(e) {
		
		var url = "api/upgrade.php"; // the script where you handle the form input.
		
		$.ajax({
		   type: "POST",
		   url: url,
		   data: $("#upgrade_form_sheba").serialize(), // serializes the form's elements.
		   success: function(data)
		   {
			
			var response = JSON.parse(data);
			
			if(response.success == 1){
				$('.bkash_upg').addClass('display_none');
				$('.sheba_upg').removeClass('display_none');
				$('.page_sections').addClass('display_none');
				$('#u_upgradeview').removeClass('display_none');
				$('.upg_member_number').html(response.message.member);
				$('.upg_sender').html(response.message.member);
				$('.upg_trxid').html(response.message.trxid);
			}else{
				$('.upgrade_form_member').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		   }
		 });
		
		e.preventDefault(); // avoid to execute the actual submit of the form.
		
	});
	//upgrade end
	// expart pages start
	$(document).on('change','.work_type',function(){
		var value = $(this).val();
		$.post('api/expart.php',{sp_load_service:value},function(data){
			var response = JSON.parse(data);
			$('.sp_load_service').html(response.message);
			
		});
	});
	$(document).on('click','.profession_select',function(){
		var value = $(this).attr('rev');
		$.post('api/expart.php',{load_professions:value},function(data){
			var response = JSON.parse(data);
			$('.profession_name').html(response.prof_name);
			$('.load_professions').html(response.message);
			$('.page_sections').addClass('display_none');
			$('#ex_expartlist').removeClass('display_none');
		});
	});
	$(document).on('click','.view_exorderdetails',function(){
		var id = $(this).attr('value');
		$.post('api/expart.php',{view_exorderdetails:id},function(data){
			var response = JSON.parse(data);
			$('.load_exorderdetails').html(response.message);
		});
	});
	$(document).on('click','.accept_order',function(){
		var id = $(this).attr('rev');
		$(this).addClass('clickdisable');
		$.post('api/expart.php',{accepted_provider : id},function(data){
			location.reload();
		});
	});
	$(document).on('click','.cancel_order',function(){
		var id = $(this).attr('rev');
		$(this).addClass('clickdisable');
		$.post('api/expart.php',{cancel_provider : id},function(data){
			location.reload();
		});
	});
	$(document).on('click','.complete_order',function(){
		var id = $(this).attr('rev');
		$(this).addClass('clickdisable');
		$.post('api/expart.php',{complited_order : id},function(data){
			location.reload();
		});
	});
	$(document).on('click','.confirm_service_order',function(){
		$.post('api/expart.php',{confirm_service_order:1},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.page_sections').addClass('display_none');
				$('#ex_congrates').removeClass('display_none');
				setTimeout(function(){
					window.location.href = 'index';
				}, 5000);
			}else{
				$('.expt_confirm_form').html('<div class="alert alert-danger">'+response.message+'</div>');
			}
		});
	});
	$(document).on('click','.expt_order_proceed_btn',function(){
		$.post('api/expart.php',{check_infos:1},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.page_sections').addClass('display_none');
				$('#ex_schedulepreview').removeClass('display_none');
				$.post('imports/ex_schedulepreview.php',function(data){
					$('#ex_schedulepreview').html(data);
				});
			}else{
				$('.expt_order_form').html('<div class="alert alert-danger">Please Save Your Informations First</div>');
			}
		});
	});
	$(document).on('click','.expart_select',function(){
		var value = $(this).attr('value');
		$.post('api/expart.php',{expart_select : value},function(){});
	});
	$(document).on('submit','#expt_order_form',function(e) {
		
		var url = "api/expart.php"; // the script where you handle the form input.
		
		$.ajax({
		   type: "POST",
		   url: url,
		   data: $("#expt_order_form").serialize(), // serializes the form's elements.
		   success: function(data)
		   {
			
			var response = JSON.parse(data);
			
			if(response.success == 1){
				$('.expt_order_form').html('<div class="alert alert-success animated fadeIn">'+response.message+'</div>');	
					
			}else{
				$('.expt_order_form').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		   }
		 });
		
		e.preventDefault(); // avoid to execute the actual submit of the form.
		
	});
	
	$(document).on('click','.set_time',function(){
		var date = $('.expert_income_date').val();
		var time = $('.expert_income_time').val();
		$.post('api/expart.php',{schedule_date : date,schedule_time: time},function(data){
			var response = JSON.parse(data);
			$('.ex_schedule_time').html(response.message.time);
			$('.ex_schedule_noon').html(response.message.noon);
			$('.ex_schedule_date').html(response.message.date);
			$('.ex_schedule_monthyear').html(response.message.monthyear);
		});
	});
	$(document).on('click','.expart_contact_infoadd',function(){
		$('.contact_person_name').html($('.expert_contact_person').val());
		$('.contact_person_number').html($('.expert_contact_number').val());
		
	});
	$(document).on('click','.get_expert_services',function(){
		var value = $(this).attr('value');
		$.post('api/expart.php',{get_exparts_service : value},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.load_exparts_services').html(response.message);
				$('.load_serviceprovider_info').html(response.expertinfo);
				$('.load_expart_title').html(response.exparttitle);
			}else{
				$('.load_exparts_services').html('<div class="alert alert-danger col">'+response.message+'</div>');
			}
		});
	});
	$(document).on('click','.add_expart_service',function(){
		var value = $(this).attr('rev');
		$(this).toggleClass('expart_service_addes');
		$.post('api/expart.php',{add_exparts_service : value},function(){
			//alert(data);
		});
	});
	$(document).on('click','.expart_location_select',function(){
		var value = $('.expart_locations').val();
		$.post('api/expart.php',{get_exparts : value},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.load_exparts').html(response.message);
				$('.load_expart_type').html(response.service_type);
			}else{
				$('.load_exparts').html('<div class="alert alert-danger col">'+response.message+'</div>');
			}
		});
	});
	// expart pages end
	$(document).on('click','.sp_add_service_btn',function(){
		$('.sp_reg_step_4_error').empty();
		var sl = $('.sp_sl').val();
		var name = $('.sp_ser_name').val();
		var price = $('.sp_ser_price').val();
		var charge = $('.sp_ser_charge').val();
		var description = $('.sp_ser_description').val();
		var comm = $('.sp_ser_company_comm').val();
		if(name){
			if(price){
				if(charge){
					if(description){
						if(comm){
							sl++;
							$('.sp_ser_name').val('');
							$('.sp_ser_price').val('');
							$('.sp_ser_charge').val('');
							$('.sp_ser_description').val(null);
							$('.sp_ser_company_comm').val('');
							
							$.post('api/sp_register.php',{ser_name : name,ser_price:price,ser_charge:charge,ser_description:description,comm:comm},function(){
								$('.show_service_lists').append('<span class="btn btn-success btn-sm float-left mr-2 sl_'+sl+'">'+name+' '+price+' <i class="fa fa-times-circle remove_sp_ser_session " rev="'+sl+'" ></i></span>');
							});
							//name+'_'+price+'_'+charge+'_'+description+'_'+comm
							//var store = '{"name":'+name+',"price":'+price+',"charge":'+charge+',"details":'+details+',"comm":'+comm+'}';
							var store = {name:name, price:price, description:description,charge:charge,comm:comm};
							var store = JSON.stringify(store);
							sessionStorage.setItem(sl, store);
							
							$('.sp_sl').val(sl);
							
						}else{
							$('.sp_reg_step_4_error').html('<div class="alert alert-danger">Company Commission</div>');
						}
					}else{
						$('.sp_reg_step_4_error').html('<div class="alert alert-danger">Description Required</div>');
					}
				}else{
					$('.sp_reg_step_4_error').html('<div class="alert alert-danger">Charge Required</div>');
				}
			}else{
				$('.sp_reg_step_4_error').html('<div class="alert alert-danger">Price Required</div>');
			}
		}else{
			$('.sp_reg_step_4_error').html('<div class="alert alert-danger">Name Required</div>');
		}
	});
	
	
	
	sessionStorage.clear();
	$(document).on('click','.remove_sp_ser_session',function() {
		var sl = $(this).attr('rev');
		sessionStorage.removeItem(sl);
		$('.sl_'+sl).remove();
		///alert(sl);
	});
	
	$(document).on('submit','#exprat_reg_form',function(e) {
		var submitbtn = $('.ex_submit_btn');
		$(submitbtn).attr('style','pointer-events:none;');
		var url = "api/sp_register.php"; // the script where you handle the form input.
		if(sessionStorage.getItem(1) !== null){
		
			$.ajax({
			   type: "POST",
			   url: url,
			   data: $("#exprat_reg_form").serialize(), // serializes the form's elements.
			   success: function(data)
			   {
				
				var response = JSON.parse(data);
				
				if(response.success == 1){
						$.each(sessionStorage, function(key, value){
							//$('.sp_reg_step_5_error').append(sessionStorage.getItem(key));
							$.post('api/sp_register.php',{setSession : sessionStorage.getItem(key)});
							
						});
						$('#exprat_reg_form').html('<section class="congratulation"><div class="cong-details text-center"><div class="cong-thumb"><img src="img/cong.png" alt="" /></div><div class="cong-text"><h4>Congratulations!</h4><p>Your Account has been Created successfully</p><a href=""><button type="button" class="btn btn-danger">Got it!</button></a></div></div></section>');
						setTimeout(function(){
						  window.location.href = 'index';
						}, 3000);
				}else{
					$('.exprat_reg_form').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
				}
			   }
			 });
		}else{
			$(submitbtn).attr('style','pointer-events:auto;');
			$('.exprat_reg_form').html('<div class="alert alert-danger animated fadeIn">একটি কাজ সংযুক্ত করুন</div>');				
							
		}
		e.preventDefault(); // avoid to execute the actual submit of the form.
		
	});
	//discount outlet start
	
	$(document).on('submit','#d_activation_form',function(e) {
		$('.submit_btn').attr('style','pointer-events:none;');
		var url = "api/outlet.php"; // the script where you handle the form input.
			$.ajax({
			   type: "POST",
			   url: url,
			   data: $("#d_activation_form").serialize(), // serializes the form's elements.
			   success: function(data)
			   {
				var response = JSON.parse(data);
				if(response.success == 1){
					if(response.message.redirect == 1){
						$('.d_activation_form').html('<div class="alert alert-success animated fadeIn">Processing</div>');
						setTimeout(function(){
							window.location.href = response.message.url;
						}, 1000);
					}else{
						$('.d_activation_form').html('<div class="alert alert-success animated fadeIn">'+response.message+'</div>');
						setTimeout(function(){
							window.location.href = 'index';
						}, 5000);
					}
				}else{
					$('.submit_btn').attr('style','pointer-events:auto;');
					$('.d_activation_form').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
				}
			   }
			 });
		e.preventDefault(); // avoid to execute the actual submit of the form.
	});
	
	$(document).on('click','.accept_outlet_discount',function(){
		var id  = $(this).data('id');
		var thisbtn = $(this);
		$(thisbtn).attr('style','pointer-events:none;');
		$.post('api/outlet.php',{accept_outlet_discount:id},function(data){
			 var response = JSON.parse(data);
			 if(response.success == 1){
				$('.outlet_request_error').html('<div class="alert alert-success">'+response.message+'</div>');
				setTimeout(function(){
				  window.location.href = 'index';
				}, 3000);
			 }else{
				 $('.outlet_request_error').html('<div class="alert alert-danger">'+response.message+'</div>');
				$(thisbtn).attr('style','pointer-events:auto;');
			 }
		 });
	});
	/*
	$(document).on('click','.accept_outlet_discount',function(e) {
		var id  = $(this).data('id');
		$.post('api/outlet.php',{accept_outlet_discount:id},function(data){
			 var response = JSON.parse(data);
			 if(response.success == 1){
				$('.outlet_request_error').html('<div class="alert alert-success">'+response.message+'</div>');
				setTimeout(function(){
				  window.location.href = 'index';
				}, 3000);
			 }else{
				 $('.outlet_request_error').html('<div class="alert alert-danger">'+response.message+'</div>');
			 }
		 });
	});
	*/
	$(document).on('click','.view_discountdetails',function(e) {
		var value  = $(this).data('id');
		var page  = $(this).data('page');
		$.post('api/outlet.php',{view_discountdetails:value,page:page},function(data){
			 var response = JSON.parse(data);
			 if(response.success == 1){
				$('.load_discountdetails').html(response.message);
				$('.page_sections').addClass('display_none');
				$('#d_viewdetails').removeClass('display_none');
			 }else{
				 $('.discount_confirm_error').html('<div class="alert alert-danger">'+response.message+'</div>');
			 }
		 });
	});
	$(document).on('click','.confirm_discount_request',function(e) {
		var type = $(this).data('type');
		$.post('api/outlet.php',{confirm_discount_request:type},function(data){
			 var response = JSON.parse(data);
			 if(response.success == 1){
				 $('.discount_confirm_error').html('<div class="alert alert-success">'+response.message+'</div>');
				setTimeout(function(){
				  window.location.href = 'index';
				}, 3000);
			 }else{
				 $('.discount_confirm_error').html('<div class="alert alert-danger">'+response.message+'</div>');
			 }
		 });
	});
	$(document).on('click','.outlet_request',function(e) {
		 var outlet_number = $('.outlet_shop_number').val();
		 var bill_amount = $('.outlet_bill_amount').val();
		 $.post('api/outlet.php',{outlet_number:outlet_number,bill_amount:bill_amount},function(data){
			 var response = JSON.parse(data);
			 if(response.success == 1){
				 $('.load_discount_review').html(response.message);
				 $('.page_sections').addClass('display_none');
				 $('#d_requestview').removeClass('display_none');
			 }else{
				 $('.discount_error').html('<div class="alert alert-danger">'+response.message+'</div>');
			 }
		 });
	});
	$(document).on('keyup','.outlet_shop_number',function(e) {
		var value = $(this).val();
		$.post('api/outlet.php',{outlet_search: value},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.outlet_list').html('<div class="alert alert-success">'+response.message+'</div>');
			}else{
				$('.outlet_list').html('<div class="alert alert-danger">'+response.message+'</div>');
			}
		});
	});
	$(document).on('submit','#outlet_reg_form',function(e) {
		var submitbtn = $('.ex_submit_btn');
		$(submitbtn).attr('style','pointer-events:none;');
		var url = "api/outlet_reg.php"; // the script where you handle the form input.
		
			$.ajax({
			   type: "POST",
			   url: url,
			   data: $("#outlet_reg_form").serialize(), // serializes the form's elements.
			   success: function(data)
			   {
				
				var response = JSON.parse(data);
				
				if(response.success == 1){
						
						$('#outlet_reg_form').html('<section class="congratulation"><div class="cong-details text-center"><div class="cong-thumb"><img src="img/cong.png" alt="" /></div><div class="cong-text"><h4>Congratulations!</h4><p>Your Account has been Created successfully</p><a href=""><button type="button" class="btn btn-danger">Got it!</button></a></div></div></section>');
						setTimeout(function(){
						  window.location.href = 'index';
						}, 3000);
				}else{
					$('.outlet_reg_form').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
				}
			   }
			 });
		
		e.preventDefault(); // avoid to execute the actual submit of the form.
		
	});
	//discount outlet  end
	$(document).on('click','.take_location_name_from',function(){
		var placehtml = $(this).html();
		$('.corporate_search').val(placehtml);
		$('.cororate_list_load').empty();
		var id = $(this).attr('rev');
		$('.load_corporate_agent_id').val(id);
		$.post('api/register.php',{corporate_id : id},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.load_local_agents').html(response.message);
			}else{
				$('.request_error').html('<div class="alert alert-danger">'+response.message+'</div>');
			}
		});
	});
	
	$(document).on('keyup','.corporate_search',function(){
		var value = $(this).val();
		//if(value.length >= 3){
			$.post('api/sp_register.php',{get_filtered:value},function(data){
				var response = JSON.parse(data);
				$('.cororate_list_load').empty();
				for(var item in response.message){
					$('.cororate_list_load').append('<option value="'+response.message[item].id+'">'+response.message[item].name+'</option>');
				
				}
			});
		//}
	});
	$('.s1').click(function(){
	   var value = $(this).attr('value');
	   $('#re_s1').val(value);
	});
	$(document).on('change','.withdraw_step_2_input',function(){
		var value = $(this).val();
		if(value == 'bank'){
			$('.mmoney_w').addClass('display_none');
			$('.bank_w').removeClass('display_none');
		}
	});
	$(document).on('click','.sing-ope',function(){
	    $('.sing-ope').attr('style','border:none;')
	    $(this).attr('style','border:1px solid red;');
	    $(this).find("[name='operator']").prop('checked',true);
	    $(this).find("[name='paytype']").prop('checked',true);
	    $(this).find("[name='w_paytype']").prop('checked',true);
		var value =  $(this).find("[name='paytype']").val();
		if(value == 'nogod'){
			$('.nogod_hidden').addClass('display_none');
			$('.nogod_info').removeClass('display_none');
			$('.other_info').addClass('display_none');
		}else{
			$('.nogod_hidden').removeClass('display_none');
			$('.nogod_info').addClass('display_none');
			$('.other_info').removeClass('display_none');
		}
	});
	/*$(document).on('change','.trasfter_select',function(){
		var value = $(this).val();
		if(value == 'tosheba'){
			$('.page_sections').addClass('display_none');
			$('#myacc_fundmanage').removeClass('display_none');
		}else if(value == 'toown'){
			$('.page_sections').addClass('display_none');
			$('#owntransfer').removeClass('display_none');
		}
	});
	
	$(document).on('click','.owntransfer_submit',function(){
		var amount = $('.owntransfer_amount').val();
		var pin = $('.owntransfer_pin').val();
		$.post('api/fund.php',{owntransfer_amount:amount,owntransfer_pin:pin},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.owntransfer_error').html('<div class="alert alert-danger" >'+response.message+'</div>');
				setTimeout(function(){
				  window.location.href = 'index';
				}, 3000);
			}else{
				$('.owntransfer_error').html('<div class="alert alert-danger" >'+response.message+'</div>');
			}
		});
	});
	*/
	$(document).on('click','.coronahelp_order',function(){
		var address = $('.coronahelp_address').val();
		$.post('api/products.php',{coronahelp_address :address},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.coronahelp_error').html('<div class="alert alert-success">'+response.message+'</div>');
				setTimeout(function(){
				  window.location.href = 'index';
				}, 3000);
			}else{
				$('.coronahelp_error').html('<div class="alert alert-danger">'+response.message+'</div>');
			}
			
		});
	});
	$(document).on('click','.mohtbazar_order',function(){
		var address = $('.mohtbazar_address').val();
		$.post('api/products.php',{mohtbazar_address :address},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.monthbazar_error').html('<div class="alert alert-success">'+response.message+'</div>');
				setTimeout(function(){
				  window.location.href = 'index';
				}, 3000);
			}else{
				$('.monthbazar_error').html('<div class="alert alert-danger">'+response.message+'</div>');
			}
			
		});
	});
	$(document).on('click','.addtocart',function(){
		var pid = $(this).attr('rev');
		$.post('api/products.php',{cart : pid},function(data){
			var response = JSON.parse(data);
			$('.cart_item').html(response.message.item);
			$('.cart_price').html(response.message.total);
		});
		$(this).addClass('bg-dark text-white');
	});
	
	$(document).on('click','.checkout_items',function(){
		$.post('api/products.php',{load_products : 1},function(data){
			var response = JSON.parse(data);
			$('.load_checkout_items').empty();
			$('.load_checkout_items').html(response.message.list);
			$('.subtotal').html(response.message.subtotal);
			$('.delivery_fee').html(response.message.charge);
			$('.all_total').html(response.message.alltotal);
			//alert(data);
		});
	});
	
	$(document).on('click','.qnty_plus',function(){
		var value = $(this).attr('rev');
		$.post('api/products.php',{qnty_plus : value},function(data){
			var response = JSON.parse(data);
			$('.single_qnty_'+value).val(response.message.singleqnty);
			$('.single_total_'+value).html(response.message.singletotal);
			$('.subtotal').html(response.message.subtotal);
			$('.delivery_fee').html(response.message.charge);
			$('.all_total').html(response.message.alltotal);
			//alert(data);
		});
	});
	$(document).on('click','.qnty_minus',function(){
		var value = $(this).attr('rev');
		$.post('api/products.php',{qnty_plus : value},function(data){
			var response = JSON.parse(data);
			$('.single_qnty_'+value).val(response.message.singleqnty);
			$('.single_total_'+value).html(response.message.singletotal);
			$('.subtotal').html(response.message.subtotal);
			$('.delivery_fee').html(response.message.charge);
			$('.all_total').html(response.message.alltotal);
			//alert(data);
		});
	});
	$(document).on('click','.cash_payment',function(){
		$('.payment_method').val('1');
		$(this).addClass('bg-success text-light');
		$('.digital_payment').removeClass('bg-success text-light');
	});
	
	$(document).on('click','.order_confirm_btn',function(){
		var paylocation = $('.paylocation').val();
		var payaddress  = $('.payaddress').val();
		var paymethod   = $('.payment_method').val();
		if(paymethod == '1'){
			$.post('api/products.php',{paylocation : paylocation,payaddress:payaddress,paymethod : paymethod},function(data){
				var response = JSON.parse(data);
				if(response.success == 1){
					$('.page_sections').addClass('display_none');
					$('#p_confirm').removeClass('display_none');
					$('.after_confirm_address').html(paylocation);
				}else{
					$('.pay_error').html('<div class="alert alert-danger">'+response.message+'</div>')
				}
			});
		}else if(paymethod == '2'){
			
			var paysender = $('.paysender').val();
			var paytrxid = $('.paytrxid').val();
			var paypin = $('.paypin').val();
			$.post('api/products.php',{
				paylocation : paylocation,
				payaddress:payaddress,
				paymethod : paymethod,
				paysender : paysender,
				paytrxid : paytrxid,
				paypin : paypin
				},function(data){
				var response = JSON.parse(data);
				if(response.success == 1){
					$('#orderModalBottom').addClass('show');
					$('#orderModalBottom').attr('style','display:block;');
					$('.after_confirm_address').html(paylocation);
					
				}else{
					$('.pay_error').html('<div class="alert alert-danger">'+response.message+'</div>')
				}
			});
		}
		
	});
	$(document).on('click','.digital_payment',function(){
		$('.payment_method').val('2');
		$(this).addClass('bg-success  text-light');
		$('.cash_payment').removeClass('bg-success text-light');
	});
	$(document).on('click','.category_box',function(){
		var value= $(this).attr('value');
		var catname= $(this).attr('catname');
		$('.category_name').html(catname);
		$.post('api/products.php',{categoryid : value},function(data){
			var response = JSON.parse(data);
			$('.products_list').empty();
			$('.products_list').html(response.message);
		});
	});
	$('.s2').click(function(){
	   var value = $(this).attr('value');
	   $('#re_s2').val(value);
	});
	$('.s3').click(function(){
	   var value = $(this).attr('value');
	   $('#re_s3').val(value);
	});
	$('.s4').click(function(){
	   var value = $(this).attr('value');
	   $('#re_s4').val(value);
	});
	$('.s5').click(function(){
	   var value = $(this).attr('value');
	   $('#re_s5').val(value);
	});
	$('.s6').click(function(){
	   var value = $(this).attr('value');
	   $('#re_s6').val(value);
	});
	$('.s7').click(function(){
	   var value = $('input[name="cause"]:checked').val();
	   $('#re_s7').val(value);
	});
	$('.s8').click(function(){
	   var value = $('input[name="fever"]:checked').val();
	   $('#re_s8').val(value);
	});
	
	$('.s10').click(function(){
	   
	   var re_s1 = $('#re_s1').val();
	   var re_s2 = $('#re_s1').val();
	   var re_s3 = $('#re_s1').val();
	   var re_s4 = $('#re_s1').val();
	   var re_s5 = $('#re_s1').val();
	   var re_s6 = $('#re_s1').val();
	   var re_s7 = $('#re_s1').val();
	   var re_s8 = $('#re_s1').val();
	   var total = 0;
	    total += eval(re_s1) + eval(re_s2) + eval(re_s3) + eval(re_s4) + eval(re_s5) + eval(re_s6) + eval(re_s7) + eval(re_s8);
	   if(total > 10){
	       $('#nagative_result').removeClass('display_none');
	       $('.corona_steps').addClass('display_none');
	    
	   }else{
	       $('#positive_result').removeClass('display_none');
	       $('.corona_steps').addClass('display_none');
	    
	   }
	});
	$(document).on('click','.next_step',function(){
	    var id = $(this).attr('rev');
	    $('.corona_steps').addClass('display_none');
	    $('#corona_step_'+id).removeClass('display_none');
	});
	$(document).on('click','.check_again',function(){
	    var id = $(this).attr('rev');
	    $('.corona_steps').addClass('display_none');
	    $('#corona_step_1').removeClass('display_none');
	});
	$(document).on('click','.login_form_show',function(){
		$('.login_form_part').show();
		$('.reg_form_part').hide();
		$('.forgot_form_part').hide();
		$('.forgot_form_otp_part').hide();
		$('.vendor_form_part').hide();
		$('#oncall2').attr('style','display:none;');
	});
	$(document).on('click','.forgot_form_show',function(){
		$('.login_form_part').hide();
		$('.forgot_form_part').show();
		$('.reg_form_part').hide();
		$('.forgot_form_otp_part').hide();
		$('.vendor_form_part').hide();
	});
	$(document).on('click','.vendor_form_show',function(){
		$('.login_form_part').hide();
		$('.forgot_form_part').hide();
		$('.reg_form_part').hide();
		$('.vendor_form_part').show();
		$('.forgot_form_otp_part').hide();
	});
	var h = $(window).height();
	$('.myaccount_menu_drower').height(h);
	$(document).on('click','.myaccount_menu_toggle',function(){
		$('.myaccount_menu_drower').removeClass('left_zero');
	});
	$(document).on('click','.myaccount_menu_drower',function(){
		$('.myaccount_menu_drower').addClass('left_zero');
	});
	$(document).on('click','.invitation_sms',function(){
		var number =  $('.invitation_number').val();
		$.post('api/activation.php',{invitation_sms : number},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.invitation_sms_error').html('<div class="alert alert-success">Invation Sent</div>');
			}else{
			$('.invitation_sms_error').html('<div class="alert alert-success">'+response.message+'</div>');
			}
		});
	});
	$(document).on('change','.whare_am_i_select',function(){
		var value = $(this).val();
		/*$('#homepage').addClass('display_none');
		$('#index').removeClass('display_none');
		$("#choise2").hide();*/
		$.post('api/register.php',{take_dealers : value},function(data){
			//location.reload();
			var response = JSON.parse(data);
			$('.select_divisional_dealer').html(response.message);
			$('.cororate_list_load').html(response.message2); 
		});
	});
	
	$(document).on('click','.account_buttons',function(){
		$('.account_buttons').removeClass('active');
		$(this).addClass('active');
	});
	$(document).on('click','.whare_am_i_select',function(){
		var value = $(this).attr('rev');
		var name = $(this).attr('name');
		
	});
	$(document).on('change','.select_divisional_dealer',function(){
		var value = $(this).val();
		$.post('api/register.php',{take_arias : value},function(data){
			var response = JSON.parse(data);
			$('.select_aria_dealer').empty();
			$('.select_aria_dealer').append(
				'<option value="">Select Aria Dealer</option>'
			);
			
			for(var item in response.message){
				$('.select_aria_dealer').append(
					'<option value="'+response.message[item].id+'">'+response.message[item].shopname+'</option>'
				);
			}
		});
	});
	$(document).on('click','.update_notify',function(){
		$('#profileupdate_notify').attr('style','display:none;');
		$('.modal-backdrop').remove();
		$('.page_sections').addClass('display_none');
		$('#profile_edit').removeClass('display_none');
		
	});
	$(document).on('change','.select_aria_dealer',function(){
		/*
		var value = $(this).val();
		$.post('api/register.php',{take_agents : value},function(data){
			var response = JSON.parse(data);
			$('.reg_step_input_4_5').empty();
			$('.reg_step_input_4_5').append(
				'<option value="">Select Sheba Point</option>'
			);
			for(var item in response.message){
				$('.reg_step_input_4_5').append(
					'<option value="'+response.message[item].id+'">'+response.message[item].shopname+'</option>'
				);
			}
		});
		*/
	});
	$(document).on('click','.reg_step_submit_0',function(){
		var input = $('.reg_step_input_0').val();
		//alert(input);
		$.post('api/register.php',{reg_controller : input},function(data){
			//alert(data);  
			var response = JSON.parse(data);
			
			if(response.success == 1){
				
					// Move to a new location or you can do something else
					$('.reg_step_0').hide();
					$('.reg_step_1').show();
				
			}else{
				$('.reg_form_step_0').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		});
	});
	$(document).on('click','.reg_step_submit_1',function(){
		var input = $('.reg_step_input_1').val();
		//alert(input);
		$.post('api/register.php',{reg_number : input},function(data){
			//alert(data);  
			var response = JSON.parse(data);
			
			if(response.success == 1){
				
					// Move to a new location or you can do something else
					$('.reg_step_1').hide();
					$('.reg_step_2').show();
				
			}else{
				$('.reg_form_step_1').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		});
	});
	$(document).on('click','.reg_step_submit_2',function(){
		var input = $('.reg_step_input_2').val();
		//alert(input);
		$.post('api/register.php',{reg_name : input},function(data){
			//alert(data);  
			var response = JSON.parse(data);
			
			if(response.success == 1){
				
					// Move to a new location or you can do something else
					$('.reg_step_2').hide();
					$('.reg_step_4').show();
				
			}else{
				$('.reg_form_step_2').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		});
	});
	$(document).on('click','.reg_step_submit_3',function(){
		var input = $('.reg_step_input_3').val();
		//alert(input);
		$.post('api/register.php',{reg_acctype : input},function(data){
			//alert(data);  
			var response = JSON.parse(data);
			
			if(response.success == 1){
				
					// Move to a new location or you can do something else
					$('.reg_step_3').hide();
					$('.reg_step_4').show();
				
			}else{
				$('.reg_form_step_3').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		});
	});
	$(document).on('click','.reg_step_submit_4',function(){
		var input = $('.reg_step_input_4').val();
		//alert(input);
		$.post('api/register.php',{reg_referer : input},function(data){
			//alert(data);  
			var response = JSON.parse(data);
			
			if(response.success == 1){
					if(response.message == 1){
					// Move to a new location or you can do something else
					$('.reg_step_4').hide();
					$('.reg_step_4_5').show();
					}else{
					$('.reg_step_4').hide();
					$('.reg_step_5').show();
					}
				
			}else{
				$('.reg_form_step_4').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		});
	});
	$(document).on('click','.reg_step_submit_4_5',function(){
		var input = $('.reg_step_input_4_5').val();
		var division = $('.select_divisional_dealer').val();
		var area = $('.select_aria_dealer').val();
		//alert(input);
		$.post('api/register.php',{district : input,division:division,area:area},function(data){
			//alert(data);  
			var response = JSON.parse(data);
			
			if(response.success == 1){
					
					$('.reg_step_4_5').hide();
					$('.reg_step_5').show();
					
				
			}else{
				$('.reg_form_step_4').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		});
	});
	$(document).on('click','.reg_step_submit_5',function(){
		var input = $('.reg_step_input_5').val();
		//alert(input);
		$.post('api/register.php',{reg_pin : input},function(data){
			//alert(data);  
			var response = JSON.parse(data);
			
			if(response.success == 1){
				
					// Move to a new location or you can do something else
					$('.reg_step_5').hide();
					$('.reg_step_6').show();
				
			}else{
				$('.reg_form_step_5').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		});
	});
	$(document).on('click','.reg_submit',function(){
		var controller = $('.reg_step_input_0').val();
		var number = $('.reg_step_input_1').val();
		var name = $('.reg_step_input_2').val();
		var type = $('.reg_step_input_3').val();
		var district = $('.reg_step_input_4_5').val();
		var referer = $('.reg_step_input_4').val();
		var pin = $('.reg_step_input_5').val();
		var pass = $('.reg_step_input_6').val();
		var conpass = $('.reg_step_input_7').val();
		
		$.post('api/register.php',{
			final_reg_controller : controller,
			final_reg_number : number,
			final_reg_name : name,
			final_reg_type : type,
			final_reg_referer : referer,
			final_reg_district : district,
			final_reg_pin : pin,
			final_reg_pass : pass,
			final_reg_conpass : conpass
			},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.reg_form_part').html('<section class="congratulation"><div class="cong-details text-center"><div class="cong-thumb"><img src="img/cong.png" alt="" /></div><div class="cong-text"><h4>Congratulations!</h4><p>Your Account has been Created successfully</p><a href=""><button type="button" class="btn btn-danger">Got it!</button></a></div></div></section>');
				setTimeout(function(){
				  window.location.href = 'index';
				}, 3000);
				
			}else if(response.success != 1){
				$('.reg_form_step_6').html('<div class="alert alert-danger">'+response.message+'</div>');
			}
			
		});
	});
	
	$(document).on('click','.usertype',function(){
		$('.usertype').attr('style','background:#fff;');
		$(this).attr('style','background:#eee;');
		var value = $(this).attr('rev');
		$('.reg_step_input_3').val(value);
	});
	$(document).on('click','.navbar_collapse',function(){
		$('.myaccount_nav').toggleClass('d-block');
	});
	$(document).on('click','.link',function(){
		$('.classy-menu').removeClass('menu-on');
		var value = $(this).attr('rev');
		if(value == 'login_alert'){
		    $('.login_alert').html('<div class="alert alert-danger animated fadeIn" >Please Login To Account</div>')
		}
	});
	$(document).on('click','.view_details',function(){
		var userid = $(this).attr('val');
		$.post('api/user_details.php',{user_informations : userid},function(data){
			
			$('.load_user_informations').empty();
			$('.load_user_informations').html(data);
			
		});
	});
	$(document).on('click','.view_shoporderdetails',function(){
		var id = $(this).attr('val');
		$.post('api/user_details.php',{view_shoporderdetails : id},function(data){
			
			$('.load_shoporderdetails').empty();
			$('.load_shoporderdetails').html(data);
			
		});
	});
	$(document).on('click','.view_earningdetails',function(){
		var id = $(this).attr('val');
		$.post('api/user_details.php',{earning_informations : id},function(data){
			
			$('.load_earning_informations').empty();
			$('.load_earning_informations').html(data);
			
		});
	});
	$(document).on('click','.view_airticketdetails',function(){
		var id = $(this).attr('val');
		$.post('api/user_details.php',{airticket_informations : id},function(data){
			
			$('.load_airticket_informations').empty();
			$('.load_airticket_informations').html(data);
			
		});
	});
	$(document).on('click','.view_servicerequests',function(){
		var id = $(this).attr('val');
		$.post('api/user_details.php',{servicerequest_informations : id},function(data){
			
			$('.load_service_request_informations').empty();
			$('.load_service_request_informations').html(data);
			
		});
	});
	
	$(document).on('click','.edit_service',function(){
		var id = $(this).attr('val');
		$.post('api/user_details.php',{edit_service_form : id},function(data){
			
			$('.load_sereditinformations').empty();
			$('.load_sereditinformations').html(data);
			
		});
	});
	$(document).on('click','.view_rechargedetails',function(){
		var id = $(this).attr('val');
		$.post('api/user_details.php',{recharge_informations : id},function(data){
			
			$('.load_recharge_informations').empty();
			$('.load_recharge_informations').html(data);
			
		});
	});
	$(document).on('click','.view_accountsdetails',function(){
		var id = $(this).attr('val');
		$.post('api/user_details.php',{accounts_informations : id},function(data){
			
			$('.load_account_informations').empty();
			$('.load_account_informations').html(data);
			
		});
	});
	$(document).on('click','.view_withdrawdetails',function(){
		var id = $(this).attr('val');
		$.post('api/user_details.php',{withdraw_informations : id},function(data){
			
			$('.load_withdraw_informations').empty();
			$('.load_withdraw_informations').html(data);
			
		});
	});
	$(document).on('click','.view_transferdetails',function(){
		var id = $(this).attr('val');
		$.post('api/user_details.php',{transfer_informations : id},function(data){
			
			$('.load_transfer_informations').empty();
			$('.load_transfer_informations').html(data);
			
		});
	});
	$(document).on('click','.view_utilitydetails',function(){
		var id = $(this).attr('val');
		$.post('api/user_details.php',{utility_informations : id},function(data){
			
			$('.load_utility_informations').empty();
			$('.load_utility_informations').html(data);
			
		});
	});
	$(document).on('click','.view_servicedetails',function(){
		var id = $(this).attr('val');
		$.post('api/user_details.php',{service_informations : id},function(data){
			
			$('.load_service_informations').empty();
			$('.load_service_informations').html(data);
			
		});
	});
	
	
	$(document).on('click','.load_areas',function(){
		var id = $(this).attr('data');
		$.post('api/user_details.php',{service_id : id},function(data){
			$('.professionals_area').empty();
			$('.professionals_area').append(data);
		});
	});
	$(document).on('click','.providers_check',function(){
		var id = $('.professionals_area').val();
		$.post('api/user_details.php',{area_id : id},function(data){
			$('.load_providers').empty();
			$('.load_providers').append(data);
		});
	});
	$(document).on('click','.book_technician',function(){
		var id = $(this).attr('value');
		$.post('api/user_details.php',{service_provided : id},function(data){
			$('.load_service_provided').empty();
			$('.load_service_provided').append(data);
		});
	});
	
	$(document).on('click','.service_add_to_cart',function(){
		var id = $(this).attr('rev');
		$.post('api/service.php',{add_to_cart : id},function(data){
			var response = JSON.parse(data);
			if(response.message == 1){
				$('.red_dot_two').removeClass('display_none');
				$('.red_dot_two').addClass('display_block');
			}
		});
	});
	$(document).on('click','.service_details_view',function(){
		var id = $(this).attr('data');
		$.post('api/user_details.php',{service_details_view : id},function(data){
			
			
				$('.load_service_details').empty();
				$('.load_service_details').append(data);
			
		});
	});
	$(document).on('click','.cart_icon_click',function(){
		$.post('api/service.php',{checkout_view : 1},function(data){
			//alert(data);
			var response = JSON.parse(data);
			
				$('.ser_for').empty();
				for(var item in response.message.name){
					$('.ser_for').append('<div class="btn btn-light float-left btn-sm mr-2">'+response.message.name[item]+'</div>');
				}
				$('.prepaid_postpaid_section').hide();
				$('.requirementslog').hide();
				$('.ser_amount').html(response.message.total);
					$('.ser_charge').html(response.message.charge);
					$('.ser_total').html(response.message.grand_total);
					$('.page_sections').addClass('display_none');
					$('#details_view').removeClass('display_none');
			
		});
		
	});
	$(document).on('click','.sp_reg_step_0_btn',function(){
		$('.vendor_step_1').addClass('display_none');
		$('.sp_reg_steps').addClass('display_none');
		$('.service_pro_reg_number').removeClass('display_none');
	});
	$(document).on('click','.sp_reg_step_00_btn',function(){
		var name = $('.sp_reg_step_00_shopname').val();
		
			
			if(name){
				$('.service_pro_reg_shopname').addClass('display_none');
				$('.service_pro_reg_number').removeClass('display_none');
			}else{
				$('.sp_reg_step_1_error').html('<div class="alert alert-danger">Name Required</div>')
			}
		
	});
	$(document).on('click','.sp_reg_step_1_btn',function(){
		var number = $('.sp_reg_step_1_number').val();
		$.post('api/sp_register.php',{number : number},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.service_pro_reg_number').addClass('display_none');
				$('.service_pro_reg_referer').removeClass('display_none');
			}else{
				$('.sp_reg_step_1_error').html('<div class="alert alert-danger">'+response.message+'</div>')
			}
		});
	});
	$(document).on('click','.sp_reg_step_11_btn',function(){
		var referer = $('.sp_reg_step_11_referer').val();
		if(referer){
			$.post('api/sp_register.php',{referer : referer},function(data){
				var response = JSON.parse(data);
				if(response.success == 1){
					$('.service_pro_reg_referer').addClass('display_none');
					$('.service_pro_reg_profession').removeClass('display_none');
				}else{
					$('.sp_reg_step_11_error').html('<div class="alert alert-danger">'+response.message+'</div>')
				}
			});
		}else{
			$('.service_pro_reg_referer').addClass('display_none');
			$('.service_pro_reg_profession').removeClass('display_none');
		}
	});
	/*
	$(document).on('click','.transfer_step_btn',function(){
		$('.transfer_step_0').removeClass('display_none');
		$('.fund_management').addClass('display_none');
	});
	$(document).on('click','.transfer_step_0_btn',function(){
		var amount = $('.transfer_step_0_input').val();
		var sheba = $('.transfer_step_user_input').val();
		$.post('api/fund.php',{transfer_fund : amount,sheba:sheba},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.transfer_step_0').addClass('display_none');
				$('.transfer_step_00').removeClass('display_none');
			}else{
				$('.transfer_step_0_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		});
	});
	$(document).on('click','.transfer_step_00_btn',function(){
		var transfer_otp = $('.transfer_step_00_input').val();
		$.post('api/fund.php',{transfer_otp : transfer_otp},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.transfer_step_00').addClass('display_none');
				$('.transfer_step_1').removeClass('display_none');
			}else{
				$('.transfer_step_00_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		});
	});
	$(document).on('click','.transfer_confirm_btn',function(){
		var amount = $('.transfer_step_0_input').val();
		var pin = $('.transfer_step_1_input').val();
		var sheba = $('.transfer_step_user_input').val();
		$.post('api/fund.php',{transfer_pin : pin,amount:amount,sheba:sheba},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.transfer_step_1').html('<section class="congratulation"><div class="cong-details text-center"><div class="cong-thumb"><img src="img/cong.png" alt="" /></div><div class="cong-text"><h4>Congratulations!</h4><p>Your Account has been Created successfully</p><a href=""><button type="button" class="btn btn-danger">Got it!</button></a></div></div></section>');
				setTimeout(function(){
				  window.location.href = 'index';
				}, 3000);
			}else{
				$('.transfer_step_1_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		});
	});
	*/
	
	
	$(document).on('submit','#nid_varifyform',function(e) {

		var url = "api/nidvarify.php"; // the script where you handle the form input.

		$.ajax({
			   type: "POST",
			   url: url,
			   data: $("#nid_varifyform").serialize(), // serializes the form's elements.
			   success: function(data)
			   {
				
				var response = JSON.parse(data);
				
				if(response.success == 1){
					$('#nid_varifyform_view').html(response.message);
					$('#nid_varifyform_view').removeClass('display_none');
					$('#nid_varifyform').addClass('display_none');
				}else{
					$('.nid_varifyform').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
				}
			   }
			 });
		e.preventDefault(); // avoid to execute the actual submit of the form.
	});
	
	$(document).on('click','.nid_tab',function(e) {
		$('#nid_varifyform_view').addClass('display_none');
		$('#nid_varifyform').removeClass('display_none');
	});
	$(document).on('submit','#login_form',function(e) {

		var url = "api/login.php"; // the script where you handle the form input.

		$.ajax({
			   type: "POST",
			   url: url,
			   data: $("#login_form").serialize(), // serializes the form's elements.
			   success: function(data)
			   {
				
				var response = JSON.parse(data);
				
				if(response.success == 1){
					window.location.href = 'index';
				}else{
					$('.login_form').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
				}
			   }
			 });
		e.preventDefault(); // avoid to execute the actual submit of the form.
	});
	$(document).on('submit','#forgot_form',function(e) {

		var url = "api/login.php"; // the script where you handle the form input.

		$.ajax({
			   type: "POST",
			   url: url,
			   data: $("#forgot_form").serialize(), // serializes the form's elements.
			   success: function(data)
			   {
				
				var response = JSON.parse(data);
				
				if(response.success == 1){
					$('.forgot_form_part').hide();
					$('.forgot_form_otp_part').show();
					
				}else{
					$('.forgot_form').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
				}
			   }
			 });
		e.preventDefault(); // avoid to execute the actual submit of the form.
	});
	$(document).on('submit','#forgot_form_otp',function(e) {

		var url = "api/login.php"; // the script where you handle the form input.

		$.ajax({
			   type: "POST",
			   url: url,
			   data: $("#forgot_form_otp").serialize(), // serializes the form's elements.
			   success: function(data)
			   {
				
				var response = JSON.parse(data);
					
				if(response.success == 1){
					$('.forgot_form_otp').html('<div class="alert alert-success animated fadeIn">'+response.message+'</div>');
					window.setTimeout(function() {
						window.location.href = 'index';
					},3000);
					
				}else{
					$('.forgot_form_otp').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
				}
			   }
			 });
		e.preventDefault(); // avoid to execute the actual submit of the form.
	});
	$(document).on('keyup','.mobile_rechargee_number',function(){
		var number = $(this).val();
		$.post('api/recharge.php',{number_change : number},function(data){
			var response = JSON.parse(data);
			$('.recharge_operator_img').attr('src',response.message);
		});
	});
	$(document).on('click','.i_pack',function(){
		var value = $(this).attr('rev');
		$('.sing-internet').addClass('display_none');
		$('.i_'+value).removeClass('display_none');
	});
	$(document).on('click','.v_pack',function(){
		var value = $(this).attr('rev');
		$('.sing-voice').addClass('display_none');
		$('.v_'+value).removeClass('display_none');
	});
	$(document).on('click','.b_pack',function(){
		var value = $(this).attr('rev');
		$('.sing-bundle').addClass('display_none');
		$('.b_'+value).removeClass('display_none');
	}); 
	$(document).on('click','.confirm_pack',function(){
		var id = $(this).attr('rev');
		$.post('api/recharge.php',{confirm_pack:id},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){ 
				$('.recharge_pack').attr('value',response.message.id);
				$('.recharge_operator_img_pack').attr('src','img/operator/'+response.message.operator+'.png');
				$('.pack_amount').attr('value',response.message.amount);
				$('.operator_type').attr('value',response.message.operator);
				$('.offer_details').empty();
				$('.offer_details').html('<table class="table" ><tr><td>Sms</td><td>MB</td><td>Minute</td></tr><tr><td>'+response.message.sms+'</td><td>'+response.message.mb+'</td><td>'+response.message.minute+'</td></tr></table>');
				$('.offer_details').html().replace('null','N/A');
				$('.page_sections').addClass('display_none');
				$('#mobile_recharge_package').removeClass('display_none');
				
			}else{
				$('.error_'+id).html('<div class="alert alert-danger col">'+response.message+'</div>');
			}
		});
	});
	$(document).on('click','.recharge_amount_btn',function(){
		$('.recharge_amount_btn').addClass('btn-outline-danger');
		$('.recharge_amount_btn').removeClass('btn-danger');
		$(this).removeClass('btn-outline-danger');
		$(this).addClass('btn-danger');
		var value = $(this).attr('rev');
		$('.rec_amount').val(value);
	});
	$(document).on('click','.disable_for_3_seconds',function(){
		var thisclass = $(this);
		$(thisclass).addClass('clickdisable');
		window.setTimeout(function() {
			$(thisclass).removeClass('clickdisable');
		
		},3000);
	});
	$(document).on('click','.recharge_forword_btn',function(){
		var amount = $('.rec_amount').val();
		var recharge_number = $('.mobile_rechargee_number').val();
		var operator = $('.recharge_operator_img').attr('src');
		$.post('api/recharge.php',
		
			{
			recharge_amount : amount,
			recharge_number : recharge_number
			},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.ser_logo').attr('src',operator);
				$('.ser_for').html('Mobile Recharge <span> '+recharge_number+'</span>');
				$('.ser_amount').html(amount);
				$('.ser_total').html(amount);
				$('.page_sections').addClass('display_none');
				$('#details_view').removeClass('display_none');
			}else{
				$('.recharge_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		});
	});

	$(document).on('click','.upgrade_btn',function(){
		var acc_type = $(this).attr('value');
		$.post('api/user.php',{acc_type : acc_type},function(data){
			
			var response = JSON.parse(data);
			$('.ser_logo').attr('src','img/operator/bkash.png');
			$('.ser_for').html('Upgrade Account <span> '+response.message.name+'</span>');
			$('.ser_amount').html(response.message.fee);
			$('.ser_total').html(response.message.fee);
			$('.prepaid_postpaid_section').hide();
			$('.page_sections').addClass('display_none');
			$('#details_view').removeClass('display_none');
		});
	});
	$(document).on('click','.pre_post_btn',function(){
		$('.pre_post_btn').removeClass('active');
		$(this).addClass('active');
		var value = $(this).attr('rev');
		$('.prepaid_postpaid').val(value);
	});
	$(document).on('click','.details_view_submit',function(){
		var pin = $('.transection_pass').val();
		var type = $('.prepaid_postpaid').val();
		//alert(pin+' '+type);
		$.post('api/recharge.php',{check_pin : pin, type : type},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$.post('api/details.php',{get_recharge_details : 1},function(data){
					var response = JSON.parse(data);
					if(response.message.ser == 'mobile_recharge'){
						$('.service_new_balance').html(response.message.rec.new_balance);
						$('.service_amount').html(response.message.rec.amount);
						$('.service_name').html('Mobile Recharge');
						$('.service_number').html('<h5>Number</h5><p>+88 '+response.message.rec.number+'</p>');
						$('#confirm_submission').attr('style','display:block;');
						$('#confirm_submission').addClass('show');
						$('.service_details').html(
						'<tr><td>Type <p> <b class="" >'+type+'</b></td><td>Mobile Operator <p> <b>'+response.message.rec.operator_name+'</b></td></tr>'
						)
					}else if(response.message.ser == 'utility'){
						$('.service_new_balance').html(response.message.uti.new_balance);
						$('.service_amount').html(response.message.uti.total);
						$('.service_charge').html('Charge '+response.message.uti.charge);
						$('.service_name').html('Pay '+response.message.uti.company);
						$('.service_number').html('<h5>Account </h5><p>'+response.message.uti.account+'</p>');
						$('#confirm_submission').attr('style','display:block;');
						$('#confirm_submission').addClass('show');
						$('.service_details').html(
						'<tr><td>Type <p> <b class="" >'+type+'</b></td><td>Utility Service <p> <b>'+response.message.uti.company+'</b></td></tr><tr><td colspan="2" >Contact Number <p> <b>'+response.message.uti.contact+'</b></td></tr>'
						)
					}else if(response.message.ser == 'air'){
						$('.service_new_balance').html(response.message.air.new_balance);
						$('.service_amount').html(response.message.air.amount);
						$('.service_name').html('Payment');
						$('.service_charge').html('Charge '+ response.message.air.charge);
						
						$('.service_number').html('<h5>Airticket For </h5><p>'+response.message.air.service[0]+' To '+response.message.air.service[1]+'</p>');
						$('#confirm_submission').attr('style','display:block;');
						$('#confirm_submission').addClass('show');
						
					}else if(response.message.ser == 'upgrade'){
						$('.bltd').html('Bkash Pay <img src="img/operator/bkash.png" width="100px"  alt="" />');
						$('.service_amount').html(response.message.upg.account_fee);
						$('.service_charge').html('Charge : No charge');
						$('.service_name').html('Pay '+response.message.upg.account_name);
						$('.service_number').html('<h5>Account </h5><p>'+response.message.upg.account_name+'</p>');
						$('#confirm_submission').attr('style','display:block;');
						$('#confirm_submission').addClass('show');
						$('.service_details').html(
						'<tr><td colspan="2" ><p>Go To Bkash Menu by Dialing *247#</p><p>Choose "Payment"</p><p>Enter our merchant bkash number 01999933628</p><p>Enter Amount '+response.message.upg.account_fee+'</p><p>Enter Referance "'+response.message.upg.account_name+'"</p><p>Enter Count 1</p><p>Enter your pin to confirm payment</p><p>Provide your transection ID here to confirm upgrade</p> <br />'+response.message.html+'</td></tr>'
						);
					}else if(response.message.ser == 'professional'){
						$.post('api/service.php',{service_confirm : 1},function(data){
							var response = JSON.parse(data);
							if(response.success == 1){
								$('.prof_invoice').html(response.message.invoice);	
								//$('.provider_number').html(response.message.contact);	
								$('.prof_total_amount').html(response.message.total);	
								$('.page_sections').addClass('display_none');
								$('#order_pay').removeClass('display_none');
							}
						});
						
						
					}
				});
			}else{
				$('.details_view_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>')
			}
		});
	});
	$(document).on('click','.pay_service_point',function(){
		var invoice = $('.prof_invoice').html();
		$.post('api/service.php',{pay_service_point : invoice},function(data){
			
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.point_pay_error').html('<img src="img/icon/checkmark.png" width="100px"  alt="" />');
				window.setTimeout(function() {
					window.location.href = 'index?page=service_history';
				},1000);
			}else{
				$('.point_pay_error').html('<div class="alert alert-danger">'+response.message+'</div>');
			}
		});
	});
	var pressTimer;
	
	$(document).on('click','.accept_act_request',function(){
		var thisid = $(this);
		var value = $(this).attr('rev');
		$(thisid).addClass('clickdisable');
		$.post('api/activation.php',{id : value},function(data){
			//alert(data);
			var response = JSON.parse(data);
			if(response.success == 1){
				location.reload();
			}else{
				$('.requesterror_'+value).html('<div class="alert alert-danger">'+response.message+'</div>');
				$(thisid).removeClass('clickdisable');
			}
		});
	});
	$(document).on('click','.longpress',function(){
		var thisclass = $(this); 
		$(thisclass).addClass('clickdisable');
		var trxid;
		var sentfrom;
		sentfrom = $('.upgrade_sentfrom').val();
		trxid = $('.upgrade_trxid').val();
		member_number = $('.member_number').val();
		window.setTimeout(function() {
		$.post('api/service.php',{service_confirm : 1,trxid : trxid,sentfrom : sentfrom,member_number:member_number},function(data){
			 var response = JSON.parse(data);
			 if(response.success == 1){
				if(response.message.redirect == 1){
					setTimeout(function(){
						window.location.href = response.message.url;
					}, 1000);
				}else{
					$('.longpress').hide();
					$('.successbtn').show();
					$('.details_table').empty();
					$('.details_table').html('<section class="congratulation"><div class="cong-details text-center"><div class="cong-thumb"><img src="img/cong.png" alt="" /></div><div class="cong-text"><h4>Congratulations!</h4><p></p><a href=""><button type="button" class="btn btn-danger">Got it!</button></a></div></div></section>');
					window.setTimeout(function() {
						window.location.href = 'index';
					},1000);
				}
			 }else{
				 $('.service_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
				$(thisclass).removeClass('clickdisable');
			 }
		 }); 
		  
	  },1000);
	});
	$(document).on('click','.users-details',function(){
		window.setTimeout(function() {
			$('.taka_ball').addClass('float-right');
			$('.all_time_visible').addClass('display_none');
			$('.balance_visible').removeClass('display_none');
		},500);
		window.setTimeout(function() {
			$('.taka_ball').removeClass('float-right');
			$('.all_time_visible').removeClass('display_none');
			$('.balance_visible').addClass('display_none');
		},4000);
	});
	$(document).on('click','.utility_payment_method',function(){
		var img_uri = $(this).attr('src');
		var value = $(this).attr('rev');
		$('.payment_method').val(value);
		$('.utility_payment_recent_mathod').attr('src',img_uri);
	});
	$(document).on('click','.bill_type',function(){
		var value = $(this).attr('value');
		$('.bill_company').val(value);
		$('.bill_company_name').html(value);
		var img = $(this).data('image');
		$('.load_bill_image').attr('src',img);
	});
	$(document).on('click','.close',function(){
		$('.modal').hide();
	});

	$(document).on('click','.pay_utility_bill',function(){
		var pin = $('.bill_pin').val();
		$.post('api/utility.php',{uti_pin:pin},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.bill_pin_error').html('<div class="alert alert-success">'+response.message+'</div>')
				window.setTimeout(function() {
					window.location.href = 'index';
				},3000);
			}else{
				$('.bill_pin_error').html('<div class="alert alert-danger">'+response.message+'</div>')
			}
		});
	});
	$(document).on('click','.utility_payment_button',function(){
		var bill_account_number = $('.bill_account_number').val();
		var bill_contact_number = $('.bill_contact_number').val();
		var bill_payment_method = $('.bill_payment_method').val();
		var bill_amount = $('.bill_amount').val();
		var bill_company = $('.bill_company').val();
		var bill_month = $('.bill_month').val();
		var paid_type = $('.paid_type').val();
		var img = $('.utility_payment_recent_mathod').attr('src');
		$.post('api/utility.php',{
			bill_account_number : bill_account_number,
			bill_contact_number : bill_contact_number,
			bill_payment_method : bill_payment_method,
			bill_amount : bill_amount,
			bill_company : bill_company,
			bill_month : bill_month,
			paid_type : paid_type
		},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.load_utility_preview').html(response.message);
				$('.page_sections').addClass('display_none');
				$('#utility_review').removeClass('display_none');
			}else{
				$('.bill_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		})
		
		/*
		var amount = $('.rec_amount').val();
		var recharge_number = $('.mobile_rechargee_number').val();
		var operator = $('.recharge_operator_img').attr('src');
		$.post('api/recharge.php',
		
			{
			recharge_amount : amount,
			recharge_number : recharge_number
			},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.ser_logo').attr('src',operator);
				$('.ser_for').html('Mobile Recharge <span> '+recharge_number+'</span>');
				$('.ser_amount').html(amount);
				$('.ser_total').html(amount);
				$('.page_sections').addClass('display_none');
				$('#details_view').removeClass('display_none');
			}else{
				$('.recharge_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		});
		*/
	});
	$(document).on('click','.utility_payment_button_prepaid',function(){
		var bill_account_number = $('.pre_account').val();
		var bill_contact_number = $('.pre_contact').val();
		var bill_payment_method = $('.pre_payment_method').val();
		var bill_amount = $('.pre_amount').val();
		var bill_company = $('.pre_company').val();
		var bill_month = $('.pre_month').val();
		var paid_type = $('.pre_paid_type').val();
		var img = $('.utility_payment_recent_mathod').attr('src');
		$.post('api/utility.php',{
			bill_account_number : bill_account_number,
			bill_contact_number : bill_contact_number,
			bill_payment_method : bill_payment_method,
			bill_amount : bill_amount,
			bill_company : bill_company,
			bill_month : bill_month,
			paid_type : paid_type
		},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.load_utility_preview').html(response.message);
				$('.page_sections').addClass('display_none');
				$('#utility_review').removeClass('display_none');
			}else{
				$('.bill_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		})
		
		
	});
	$(document).on('click','.utility_payment_button_wasa',function(){
		var bill_account_number = $('.wasa_account_number').val();
		var bill_contact_number = $('.wasa_contact_number').val();
		var bill_payment_method = $('.wasa_payment_method').val();
		var bill_amount = $('.wasa_bill_amount').val();
		var bill_company = $('.wasa_bill_company').val();
		var bill_month = $('.wasa_bill_month').val();
		var paid_type = $('.wasa_paid_type').val();
		var img = $('.utility_payment_recent_mathod').attr('src');
		$.post('api/utility.php',{
			bill_account_number : bill_account_number,
			bill_contact_number : bill_contact_number,
			bill_payment_method : bill_payment_method,
			bill_amount : bill_amount,
			bill_company : bill_company,
			bill_month : bill_month,
			paid_type : paid_type
		},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.load_utility_preview_wasa').html(response.message);
				$('.page_sections').addClass('display_none');
				$('#utility_wasareview').removeClass('display_none');
			}else{
				$('.bill_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		})
		
		/*
		var amount = $('.rec_amount').val();
		var recharge_number = $('.mobile_rechargee_number').val();
		var operator = $('.recharge_operator_img').attr('src');
		$.post('api/recharge.php',
		
			{
			recharge_amount : amount,
			recharge_number : recharge_number
			},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.ser_logo').attr('src',operator);
				$('.ser_for').html('Mobile Recharge <span> '+recharge_number+'</span>');
				$('.ser_amount').html(amount);
				$('.ser_total').html(amount);
				$('.page_sections').addClass('display_none');
				$('#details_view').removeClass('display_none');
			}else{
				$('.recharge_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		});
		*/
	});
	$(document).on('click','.utility_payment_button_btcl',function(){
		var bill_account_number = $('.btcl_account_number').val();
		var bill_contact_number = $('.btcl_contact_number').val();
		var bill_payment_method = $('.btcl_payment_method').val();
		var bill_amount = $('.btcl_bill_amount').val();
		var bill_company = $('.btcl_company').val();
		var bill_month = $('.btcl_bill_month').val();
		var paid_type = $('.btcl_paid_type').val();
		$.post('api/utility.php',{
			bill_account_number : bill_account_number,
			bill_contact_number : bill_contact_number,
			bill_payment_method : bill_payment_method,
			bill_amount : bill_amount,
			bill_company : bill_company,
			bill_month : bill_month,
			paid_type : paid_type
		},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.load_utility_preview_btcl').html(response.message);
				$('.page_sections').addClass('display_none');
				$('#utility_btclreview').removeClass('display_none');
			}else{
				$('.bill_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		})
		
		/*
		var amount = $('.rec_amount').val();
		var recharge_number = $('.mobile_rechargee_number').val();
		var operator = $('.recharge_operator_img').attr('src');
		$.post('api/recharge.php',
		
			{
			recharge_amount : amount,
			recharge_number : recharge_number
			},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.ser_logo').attr('src',operator);
				$('.ser_for').html('Mobile Recharge <span> '+recharge_number+'</span>');
				$('.ser_amount').html(amount);
				$('.ser_total').html(amount);
				$('.page_sections').addClass('display_none');
				$('#details_view').removeClass('display_none');
			}else{
				$('.recharge_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		});
		*/
	});
	$(document).on('click','.utility_payment_button_gas',function(){
		var bill_account_number = $('.gas_account_number').val();
		var bill_contact_number = $('.gas_contact_number').val();
		var bill_payment_method = $('.gas_payment_method').val();
		var bill_amount = $('.gas_bill_amount').val();
		var bill_company = $('.gas_bill_company').val();
		var bill_month = $('.gas_bill_month').val();
		var paid_type = $('.gas_paid_type').val();
		var img = $('.utility_payment_recent_mathod').attr('src');
		$.post('api/utility.php',{
			bill_account_number : bill_account_number,
			bill_contact_number : bill_contact_number,
			bill_payment_method : bill_payment_method,
			bill_amount : bill_amount,
			bill_company : bill_company,
			bill_month : bill_month,
			paid_type : paid_type
		},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.load_utility_preview_wasa').html(response.message);
				$('.page_sections').addClass('display_none');
				$('#utility_wasareview').removeClass('display_none');
			}else{
				$('.bill_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		})
		
		/*
		var amount = $('.rec_amount').val();
		var recharge_number = $('.mobile_rechargee_number').val();
		var operator = $('.recharge_operator_img').attr('src');
		$.post('api/recharge.php',
		
			{
			recharge_amount : amount,
			recharge_number : recharge_number
			},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.ser_logo').attr('src',operator);
				$('.ser_for').html('Mobile Recharge <span> '+recharge_number+'</span>');
				$('.ser_amount').html(amount);
				$('.ser_total').html(amount);
				$('.page_sections').addClass('display_none');
				$('#details_view').removeClass('display_none');
			}else{
				$('.recharge_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		});
		*/
	});
	$(document).on('click','.addfund_step_0_btn',function(data){
		$('.addfund_step_0').removeClass('display_none');
		$('.fund_management').addClass('display_none');
	});
	$(document).on('click','.addf_step_0_btn',function(data){
		var amount = $('.addf_step_0_input').val();
		if(amount){
			$.post('api/fund.php',{sent_amount : amount},function(data){
				var response = JSON.parse(data);
				if(response.success == 1){
					$('.addfund_step_0').addClass('display_none');
					$('.addfund_step_1').removeClass('display_none');
				}else{
					$('.addf_step_0_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
				}
			});
			
		}else{
			$('.addf_step_0_error').html('<div class="alert alert-danger animated fadeIn">Amount Required</div>');
		}
	});
	$(document).on('click','.addf_step_1_btn',function(data){
		var sender = $('.addf_step_1_input').val();
		if(sender){
			$('.addfund_step_1').addClass('display_none');
			$('.addfund_step_2').removeClass('display_none');
		}else{
			$('.addf_step_1_error').html('<div class="alert alert-danger animated fadeIn">Sender Number Required</div>');
		}
	});
	$(document).on('click','.addf_step_2_btn',function(data){
		var amount = $('.addf_step_0_input').val();
		var sender = $('.addf_step_1_input').val();
		var trxid = $('.addf_step_2_input').val();
		if(trxid){
			$.post('api/fund.php',{amount:amount,sender:sender,trxid:trxid},function(data){
				var response = JSON.parse(data);
				if(response.success == 1){
					$('.addf_step_2_error').html('<section class="congratulation"><div class="cong-details text-center"><div class="cong-thumb"><img src="img/cong.png" alt="" /></div><div class="cong-text"><h4>Congratulations!</h4><p>Request Successfull</p><a href=""><button type="button" class="btn btn-danger">Got it!</button></a></div></div></section>');
					window.setTimeout(function() {
						window.location.href = 'index';
					},3000);
				}else{
					$('.addf_step_2_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
				}
			});
		}else{
			$('.addf_step_2_error').html('<div class="alert alert-danger animated fadeIn">Transection ID Required</div>');
		}
	});
	$(document).on('click','.withdraw_step_0_btn',function(){
		$('.withdraw_step_00').removeClass('display_none');
		$('.fund_management').addClass('display_none');
	});
	$(document).on('click','.withdraw_step_00_btn',function(){
		var wallet = $('.withdraw_step_0_input').val();
		if(wallet){
			$('.withdraw_step_00').addClass('display_none');
			$('.withdraw_step_0').removeClass('display_none');
		}else{
			$('.withdraw_step_1_error').html('<div class="alert alert-danger animated fadeIn">Payment Method Required</div>');
		}
	});
	$(document).on('click','.withdraw_step_1_btn',function(){
		var amount = $('.withdraw_step_1_input').val();
		var wallet = $('.withdraw_step_0_input').val();
		if(amount){
			$.post('api/withdraw.php',{amount:amount,wallet:wallet},function(data){
				var response = JSON.parse(data);
				if(response.success == 1){
					$('.withdraw_step_0').addClass('display_none');
					$('.withdraw_step_1').removeClass('display_none');
				}else{
					$('.withdraw_step_0_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
					
				}
			});
		}else{
			$('.withdraw_step_0_error').html('<div class="alert alert-danger animated fadeIn">Amount Required</div>');
		}
	});
	$(document).on('click','.withdraw_step_4_btn',function(){
		var receiver = $('.withdraw_step_3_input').val();
		var bankname = $('.withdraw_step_31_input').val();
		var accountnumber = $('.withdraw_step_32_input').val();
		var branch = $('.withdraw_step_33_input').val();
		var wallet = $('.withdraw_step_0_input').val();
		var method = $('.withdraw_step_2_input').val();
		var amount = $('.withdraw_step_1_input').val();
		var pin = $('.withdraw_step_4_input').val();
		if(pin){
			$.post('api/withdraw.php',{w_bankname:bankname,w_accountnumber:accountnumber,w_branch:branch,w_wallet:wallet,w_receiver:receiver,w_method:method,w_amount:amount,w_pin:pin},function(data){
				var response = JSON.parse(data);
				if(response.success == 1){
					$('.withdraw_step_4_error').html('<section class="congratulation"><div class="cong-details text-center"><div class="cong-thumb"><img src="img/cong.png" alt="" /></div><div class="cong-text"><h4>Congratulations!</h4><p>Request Submitted</p><a href=""><button type="button" class="btn btn-danger">Got it!</button></a></div></div></section>');
					window.setTimeout(function() {
						window.location.href = 'index';
					},3000);
				}else{
					$('.withdraw_step_4_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
					
				}
			});
		}else{
			$('.withdraw_step_3_error').html('<div class="alert alert-danger animated fadeIn">Amount Required</div>');
		}
	});
	$(document).on('click','.withdraw_step_2_btn',function(){
		var method = $('.withdraw_step_2_input').val();
		if(method){
			$('.withdraw_step_1').addClass('display_none');
			$('.withdraw_step_2').removeClass('display_none');
		}else{
			$('.withdraw_step_1_error').html('<div class="alert alert-danger animated fadeIn">Payment Method Required</div>');
		}
	});
	$(document).on('click','.withdraw_step_3_btn',function(){
		var method = $('.withdraw_step_2_input').val();
		var receiver = $('.withdraw_step_3_input').val();
		var bankname = $('.withdraw_step_31_input').val();
		var accountnumber = $('.withdraw_step_32_input').val();
		var branch = $('.withdraw_step_33_input').val();
		$.post('api/withdraw.php',{method:method,receiver:receiver,bankname:bankname,accountnumber:accountnumber,branch:branch},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$.post('api/withdraw.php',{set_otp : 1},function(data){
					$('.withdraw_step_2').addClass('display_none');
					$('.withdraw_step_22').removeClass('display_none'); 
				});
			}else{
				$('.withdraw_step_2_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			}
		});
		
	});
	$(document).on('click','.withdraw_step_22_btn',function(){
		var otp = $('.withdraw_step_22_input').val();
		if(otp){
			$.post('api/withdraw.php',{withdraw_otp:otp},function(data){
			    var response = JSON.parse(data);
			    if(response.success == 1){
			        $('.withdraw_step_22').addClass('display_none');
			        $('.withdraw_step_3').removeClass('display_none');
			    }else{
			        $('.withdraw_step_22_error').html('<div class="alert alert-danger animated fadeIn">'+response.message+'</div>');
			    }
			});
		}else{
			$('.withdraw_step_22_error').html('<div class="alert alert-danger animated fadeIn">OTP Required</div>');
		}
	});
	//airtickets
	$(document).on('change','.air_type',function(){
		var value =  $(this).val(); 
		$('.air_form').addClass('display_none');
		$('.'+value+'_form').removeClass('display_none');
		
	}); 
	$(document).on('click','.pay_airticket',function(){
		var pin = $('.airticket_pin').val();
		var id = $(this).data('id');
		var advance = $(this).data('advance');
		$.post('api/air.php',{air_id : id,air_advance:advance,air_pin:pin},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){	
					$('.airticket_error').html('<div class="alert alert-success">'+response.message+'</div>');
					
					window.setTimeout(function() {
						window.location.href = 'index';
					},3000);
					
			}else{
				$('.airticket_error').html('<div class="alert alert-danger">'+response.message+'</div>');
					
			}
		});
	});
	$(document).on('click','.view_airdetails_last',function(){
		var id = $(this).data('aid');
		$.post('api/air.php',{get_air_details_last : id},function(data){
			var response = JSON.parse(data);
				
				$('.load_air_details_last').html(response.message);
				$('.page_sections').addClass('display_none');
				$('#air_detailslast').removeClass('display_none');
			
		});
	});
	$(document).on('click','.view_airdetails',function(){
		var id = $(this).data('aid');
		$.post('api/air.php',{get_air_details : id},function(data){
			var response = JSON.parse(data);
				
				$('.load_air_details').html(response.message);
				$('.page_sections').addClass('display_none');
				$('#air_details').removeClass('display_none');
			
		});
	});
	$(document).on('click','.select_air_company',function(){
		var aid =  $(this).data('aid');
		$.post('api/air.php',{get_roots : aid},function(data){
			var response = JSON.parse(data);
				
				$('.load_roots').html(response.message);
				$('.page_sections').addClass('display_none');
				$('#air_roots').removeClass('display_none');
			
		});
		
	});
	
	$(document).on('click','.air_oneway_form',function(){
		var type = $('.air_type').val();
		var airone_from = $('.airone_from').val();
		var airone_to = $('.airone_to').val();
		var airone_name = $('.airone_name').val();
		var airone_number = $('.airone_number').val();
		var airone_leaving = $('.airone_leaving').val();
		var airone_adults = $('.airone_adults').val();
		var airone_children = $('.airone_children').val();
		var airone_infants = $('.airone_infants').val();
		var airone_evoucher = $('.airone_evoucher').val();
		var air_company = $('.air_company').val();
		$.post('api/air.php',{
			type : type,	
			airone_from : airone_from,	
			airone_to : airone_to,	
			airone_name : airone_name,	
			airone_number : airone_number,	
			airone_leaving : airone_leaving,	
			airone_adults : airone_adults,	
			airone_children : airone_children,	
			airone_infants : airone_infants,	
			airone_evoucher : airone_evoucher,
			air_company : air_company	
			
			
		},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.air_one_form').html('<section class="congratulation"><div class="cong-details text-center"><div class="cong-thumb"><img src="img/cong.png" alt="" /></div><div class="cong-text"><h4>Congratulations!</h4><p>Request Submitted</p><a href=""><button type="button" class="btn btn-danger">Got it!</button></a></div></div></section>');
					window.setTimeout(function() {
						window.location.href = 'index';
					},3000);
			}else{
				$('.airone_error').html('<div class="alert alert-danger">'+response.message+'</div>');
			}
		});
	});
	
	$(document).on('click','.airtwo_submit_btn',function(){
		var type = $('.air_type').val();
		var airone_from = $('.airtwo_from').val();
		var airone_to = $('.airtwo_to').val();
		var airone_name = $('.airtwo_name').val();
		var airone_number = $('.airtwo_number').val();
		var airone_leaving = $('.airtwo_leaving').val();
		var airone_return = $('.airtwo_return').val();
		var airone_adults = $('.airtwo_adults').val();
		var airone_children = $('.airtwo_children').val();
		var airone_infants = $('.airtwo_infants').val();
		var airone_evoucher = $('.airtwo_evoucher').val();
		var air_company = $('.air_company').val();
		$.post('api/air.php',{
			type : type,	
			airtwo_from : airone_from,	
			airtwo_to : airone_to,	
			airtwo_name : airone_name,	
			airtwo_number : airone_number,	
			airtwo_leaving : airone_leaving,	
			airtwo_return : airone_return,	
			airtwo_adults : airone_adults,	
			airtwo_children : airone_children,	
			airtwo_infants : airone_infants,	
			airtwo_evoucher : airone_evoucher,
			air_company : air_company	
			
			
		},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.air_return_form').html('<section class="congratulation"><div class="cong-details text-center"><div class="cong-thumb"><img src="img/cong.png" alt="" /></div><div class="cong-text"><h4>Congratulations!</h4><p>Request Submitted</p><a href=""><button type="button" class="btn btn-danger">Got it!</button></a></div></div></section>');
					window.setTimeout(function() {
						window.location.href = 'index';
					},3000);
			}else{
				$('.airone_error').html('<div class="alert alert-danger">'+response.message+'</div>');
			}
		});
		
		
	});
	$(document).on('click','.airticket_pay_btn',function(){
		var id = $(this).attr('rev');
		$.post('api/air.php',{air_pay : id},function(data){
			var response = JSON.parse(data);
			if(response.success == 1){
				$('.ser_logo').attr('src','img/air/'+response.message.air_company);
				$('.ser_for').html('<button class="badge badge-info">'+response.message.service[0]+'</button> To <button class="badge badge-info">'+response.message.service[1]+'</button>');
				$('.ser_charge').html(response.message.charge);
				$('.ser_amount').html(response.message.amount);
				$('.ser_total').html(response.message.total);
				$('.prepaid_postpaid_section').hide();
				$('.page_sections').addClass('display_none');
				$('#details_view').removeClass('display_none');
			}else{
				
			}
		});
	});
	
});
$(function () {
  'use strict'

  $('[data-toggle="offcanvas"]').on('click', function () {
    $('.digital_services').toggleClass('open')
  })
})
$(function () {
  'use strict'

  $('[data-toggle="offcanvasp"]').on('click', function () {
    $('.offcanvas-collapse2').toggleClass('open')
  })
})
$(function () {
  'use strict'

  $('[data-toggle="offcanvase"]').on('click', function () {
    $('.offcanvas-collapse3').toggleClass('open')
  })
})
$(function () {
  'use strict'

  $('[data-toggle="offcanvasv"]').on('click', function () {
    $('.vehicle_rent').toggleClass('open')
  })
})
$(function () {
  'use strict'

  $('[data-toggle="offcanvast"]').on('click', function () {
    $('.travels_tours').toggleClass('open')
  })
})
$(function () {
  'use strict'

  $('[data-toggle="offcanvash"]').on('click', function () {
    $('.health_service').toggleClass('open')
  })
})

$(function () {
  'use strict'

  $('[data-toggle="offcanvasd"]').on('click', function () {
    $('.discount_savings').toggleClass('open')
  })
})

$(function () {
  'use strict'

  $('[data-toggle="offcanvas1"]').on('click', function () {
    $('.offcanvas-collapse1').toggleClass('open')
  })
})
$(function () {
  'use strict'

  $('[data-toggle="offcanvas2"]').on('click', function () {
    $('.offcanvas-collapse-login').toggleClass('open')
  })
})
