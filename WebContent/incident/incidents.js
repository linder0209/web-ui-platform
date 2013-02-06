/**
 * incidents
 * 
 * @author Linder Wang
 */
(function(view) {
    view.incidents = view.incidents || {};
    var pub = {
        initPage: function(context) {
            var me = this;
            this.pageContext = context;
            $('#main_tabs a').click(function(e) {
                e.preventDefault();
                var element = $(this),
                    tmplId = element.attr('tmplId'),
                    url = element.attr('href');

                element.addClass('mouse_out').siblings().removeClass('mouse_out');
                switch (tmplId) {
                    case 'all_incidents_tmpl':
                        window.location.hash = 'incidents';                       
                        me.loadAllIncidents(url, tmplId);                        
                        break;
                    case 'incident_templates_tmpl':
                        window.location.hash = 'templates';
                        me.loadIncidentTemplates(url, tmplId);                        
                        break;
                    case 'incident_variables_tmpl':
                        window.location.hash = 'variables';
                        me.loadIncidentVariables(url, tmplId);
                        break;
                }

            });
            var index = 0;
            if (window.location.hash) {
                switch(window.location.hash){
                    case '#incidents':
                        index = 0;
                        break;
                    case '#templates':
                        index = 1;
                        break;
                   case '#variables':
                        index = 2;
                        break;
                }
            }
            $('#main_tabs a:eq(' + index + ')').click();



            $.validator.addMethod('itemsduplicate', function(value, element, param) {
                var values = {},
                        inputs = $(element).closest('ul').find('input').not(element),
                        lastRepeatValue = $(element).prop('lastRepeatValue'),
                        repeatInputs = [];
                $(element).prop('lastRepeatValue', $.trim(value));
                inputs.each(function(index, element) {
                    values[$.trim($(this).val())] = true;
                    if ($.trim($(this).val()) == lastRepeatValue) {
                        repeatInputs.push(element);
                    }
                });
                //console.info(repeatInputs);
                // remove validation info
                if (lastRepeatValue != $.trim(value) && repeatInputs.length == 1) {
                    $(repeatInputs[0]).removeClass('error').next('label.error').remove();
                }

                if (values[$.trim(value)]) {
                    return false;
                } else {
                    return true;
                }

            }, i18n['setting.error.items.duplicated']);
           
           $(document).click(function(e) {
                var target = $(e.target);
                if (target.attr('name') == 'folderSelect' || target.parent().attr('name') == 'folderSelect') {
                    return;
                }
                $('#folderSelectCt').hide();
                e.stopPropagation();
            });
           $('#add_incident').click(function(e){
        	   //${ctx }/incidents/incident/create)
           });
        },
        loadAllIncidents: function(url, tmplId) {
            $('#add_incident').show().siblings().hide();
            var id = tmplId.substring(0, tmplId.lastIndexOf('_'));
            var tab = $('#' + id);
            $('#tab_container').children().hide();
            if(tab.length > 0 ){
                tab.show();
                $('#incidents_gridTable').jqGrid('resizeGrid');
                return;
            }
            $('#tab_container').append($('#' + tmplId).tmpl().attr('id', id));
            var me = this;
            me.updateStatusSummary("", "");
            me.checkLiveTemplate();
            //init advanced search
            if(!this.advancedSearch_incidents){
                this.advancedSearch_incidents = EB_Common.advancedSearch.initialize({
                    context: this.pageContext,
                    url : EB_Common.Ajax.wrapperUrl("/incidents/incident/getAdvancedSearchItems"),
                    callback : {
                        search : function(conditions){
                        	var str = EB_Common.json.stringify(conditions);
                            $("#incidents_gridTable").jqGrid('clearGridData');
                            $("#incidents_gridTable").jqGrid('setGridParam', {postData: {conditions : str}, page: 1}).trigger('reloadGrid');     
                            me.updateStatusSummary("", str);
                        },
                        close:function(){
                       	 	$("#incidents_gridTable").jqGrid('clearGridData');
                            $("#incidents_gridTable").jqGrid('setGridParam', {postData: {conditions : ""}, page: 1}).trigger('reloadGrid');
                            var queryString = encodeURIComponent($("#searchName_incident").val());
                            me.updateStatusSummary(queryString, "");
                       }
                     }
                });
                 //advanceSearch_incident
                $('#advanceSearch_incident').click(function(e) {
                    e.preventDefault();                    
                    me.advancedSearch_incidents.load('ajax_advancedSearch_incidents');
                });
            }
            
            $('[name="incidents_list_tabs"] li', '#' + id).click(function() {
                $(this).addClass('current').siblings().removeClass('current');
                var status = $(this).attr('status');
                $("#incidents_gridTable").jqGrid('clearGridData');
                $("#incidents_gridTable").jqGrid('setGridParam', {postData: {status: status}, page: 1}).trigger('reloadGrid');
            });
            
            $('#incidents_gridTable').jqGrid({
                url: url,
                datatype: 'json',
                mtype: 'get',
                contentType: 'application/json',
                autoencode: true,
                emptyDataCaption: i18n['global.grid.emptyDataCaption'],
                jsonReader: {
                    root: 'data',
                    page: 'currentPageNo',
                    total: 'totalPageCount',
                    records: 'totalCount',
                    repeatitems: false
                },
                height: 'auto',
                autowidth: true,
                viewrecords: true,
                pager: '#incidents_gridPager',
                scrollOffset: 0,
                prmNames: {
                    page: 'pageNo',
                    totalrows: 'totalrows'
                },
                colNames: [i18n['global.status'],
                    i18n['setting.topic.subscriptionFields.name'],
                    i18n['incident.column.openduration'],
                    i18n['incident.column.openedon'],
                    i18n['incident.column.lastupdated'],
                    i18n['incident.column.closedon']],
                colModel: [{
                        name: 'incidentStatus',
                        index: 'incidentStatus',
                        width: 70,
                        title: false,
                        formatter: function(val, rec, rowObject) {
                            var ret = '';
                            if (val == 'Open') {
                                ret = i18n['incident.status.open'];
                                ret = '<span class="gray_bg2">' + ret + '</span> <a class="b-incidents-normal"  name="folderSelect" href="#">\n\
                                <span recordId="'+rowObject.id+'">' + i18n['incident.action'] + '</span><i class="icon_gray_downarrow"></i></a>';
                            } else if (val == 'Closed') {
                                ret = i18n['incident.status.close'];
                            }
                            return ret;
                        }
                    }, {
                        name: 'name',
                        index: 'name',
                        width: 100,
                        formatter: function(val, rec, rowObject) {
                            return '<a  href="'+EB_Common.Ajax.wrapperUrl("/incidents/incident/"+rowObject.id+"/notifications/")+'">' + $.jgrid.htmlEncode(val) + '</a>';
                        }
                    }, {
                        name: 'duration',
                        index: 'duration',
                        width: 80,
                        sortable: false,
                        formatter: function(val, rec, rowObject) {
                           var timeString = me.time_To_dayhhmmss(val); 
                           var arr = timeString.split(":");
                           var durationVal = i18n["incident.list.duration.formatter"].replace("{0}",arr[0]).replace("{1}", arr[1]).replace("{2}",arr[2]).replace("{3}",arr[3]);
                            return durationVal;
                        }
                    }, {
                        name: 'createdDate',
                        index: 'createdDate',
                        width: 80
                    }, {
                        name: 'lastModifiedDate',
                        index: 'lastModifiedDate',
                        width: 80
                    }, {
                        name: 'closeDate',
                        index: 'closeDate',
                        width: 80,
                        formatter:function(val, rec, rowObject){
                        	return !!val?val:"<div style='text-align:center'>--</div>";
                        }
                    }],
                gridComplete: function() {
                	// call update status summary when the grid load complate
                	//me.updateStatusSummary();
                    $('[name="folderSelect"]', '#' + id).click(function(e) {
                    	var incidentId = $(this).find('span').attr('recordId');
                        if ($('#folderSelectCt').length === 0) {
                            $('<ul id="folderSelectCt" class="b-indident-select-ct" style="display: none;">').appendTo(document.body);
                            $('#folderSelectCt').on('click', 'a', function(e) {
                                var actionType = $(this).attr('actionType');
                                /*if (actionType == '3' || actionType == '2') {
                                    EB_Common.dialog.confirm(
                                            'Are you sure you want to close this incident?',
                                            'Close Incident', function() {
                                        //operate
                                    });
                                }*/
                                switch (actionType) {
								case '1':
									window.location.href=EB_Common.Ajax.wrapperUrl("/incidents/incident/send/"+incidentId);
									break;
								case '2':
									EB_Common.dialog.confirm(
                                        i18n['incident.confirm.close'],i18n['global.threshold.delete.comfirmtitle'], function() {
                                            window.location.href=EB_Common.Ajax.wrapperUrl("/incidents/incident/closeWithSend/"+incidentId);
                                    });
									break;
								case '3':
									EB_Common.dialog.confirm(
                                        i18n['incident.confirm.close'],i18n['global.threshold.delete.comfirmtitle'],function() {
                                        	EB_Common.Ajax.put("/incidents/incident/closeWithoutSend/"+incidentId,null,function(data){
                            	                if(data.result.success){
                            	                	$("#incidents_gridTable").jqGrid().trigger("reloadGrid");
                            	                } else{
                            	                    EB_Common.dialog.alert(data.result.message,null);
                            	                }
                            	                generating = false;
                            	            });
                                        });
									break;
								default:
									break;
								}
                                	
                                return false;
                            });
                        }

                        var el = $(this),
                            offset = el.offset(),
                            height = el.height(),
                            liTmpl = '';
                    
                        liTmpl += '<li class="nowrap"><a href="#" actionType="1">' + i18n['incident.action.send'] + '</a></li>';
                        liTmpl += '<li class="nowrap"><a href="#" actionType="2">' + i18n['incident.action.closesend'] + '</a></li>';
                        liTmpl += '<li class="nowrap"><a href="#" actionType="3">' + i18n['incident.action.close'] + '</a></li>';
                        
                        var folderSelectCt = $('#folderSelectCt');
                            folderSelectCt.empty().append(liTmpl);
                        var folderCtH = folderSelectCt.height();
                        var top = offset.top + height + 5;
                        if(offset.top + folderCtH > EB_Common.Element.getViewportHeight()){
                            top = offset.top - folderCtH - height;
                        }
                        folderSelectCt.css({left: offset.left, top: top}).show();
                        return false;
                    });
                    
                }
            });
            
            $("#searchIncidents").click(function(e) {
                e.preventDefault();
                me.quickSearchIncidents();
            });
            
            $("#searchName_incident").keyup(function(e) {            	
                e.preventDefault();
                if(e.keyCode==13) {
                	me.quickSearchIncidents();
                }               
            });
        },
        checkLiveTemplate:function(){
        	EB_Common.Ajax.get("/incidents/template/hasLiveTemplates", null, function(data) {
        		if(data==true) {
        			$("#add_incident").css("visibility","visible");
        		} else {
        			$("#add_incident").css("visibility","hidden");
        		}
        	})
        },
        	
        //open{},close{} and all{}
        updateStatusSummary:function(quickString, advancedVals) {        	
        	var condition = {};
        	if (advancedVals!="") { //advanced search open
        		condition = {conditions: advancedVals};        		
        	} else { // quicksearch        		
        		condition = {queryString: quickString};
        	}
        	
        	EB_Common.Ajax.post("/incidents/incident/getIncidensNumber", condition, function(data) {
                if (data) {    
                	$("#spnNumOpen").text(data.Open);
                	$("#spnNumClosed").text(data.Closed);
                	$("#spnNumAll").text(data.All);  
                	if(advancedVals!="") {
                		$("#liOpen").css("display","none");
                		$("#liClosed").css("display","none");
                	} else {
                		$("#liOpen").css("display","");
                		$("#liClosed").css("display","");
                	}
                	
                } 
            });
        },
        quickSearchIncidents:function(){
       	 	var queryString = encodeURIComponent($("#searchName_incident").val());
            $("#incidents_gridTable").jqGrid('setGridParam', {postData: {queryString: queryString}, page: 1}).trigger("reloadGrid");
            this.updateStatusSummary(queryString, "");
        },
        loadIncidentTemplates: function(url, tmplId) {
           /* $('#add_template').show().siblings().hide();  */
            var id = tmplId.substring(0, tmplId.lastIndexOf('_'));
            var tab = $('#' + id);
            $('#tab_container').children().hide();
            if(tab.length > 0 ){
                tab.show();
                $('#templates_gridTable').jqGrid('resizeGrid');
                return;
            }
            $('#tab_container').append($('#' + tmplId).tmpl().attr('id', id));            
            function getValues(){
            	var dts = $("#initVariableTemplateBox .formitem"), formtItems = [];
            	dts.each(function(i,v) {
            		var key = $(v).attr("key"),value = $(v).val()||$(v).html();
            		formtItems.push({"val":value,"variableName":key});
            	});
            	if (formtItems.length > 0) {
            		me.dataobj['bodyItems'] = formtItems;
            	}
            	
            	var texts = $("#initVariableMsessageBox .formitem");
            	texts.each(function(i,v){
            		var k = $(v).attr("key"),value = $(v).val()||$(v).html();
            		me.dataobj['' + k] = value;
            	});
            }
            
            //listener event
            $('#template_tabs a').click(function(e){
                var tab = $(this).attr('tab');
                $('#template_tabs a').removeClass('current');
                if(tab){
                    $(this).addClass('current');
                    $('#template_tabs_items').find('[tabName="' + tab + '"]').show().siblings().hide();
                    if(tab == "message") {
                    	getValues();
                    	//初始化message
                    	$("#initVariableMsessageBox").empty();
                    	$("#initVariableMsessageBox").append($("#incident_variables_message_tmpl").render(me.dataobj));
                    	
                    }
                }
                return false;
            });
            $('#templateTest').click(function(){
            	getValues();
                var el = $($('#template_preview_tmpl').render(me.dataobj));
                EB_Common.dialog.dialog(el,{title:'Test',height:500});
            });
            var me = this;
            //init advanced search
       
            if(!this.advancedSearch_templates){
                this.advancedSearch_templates = EB_Common.advancedSearch.initialize({
                    context: this.pageContext,
                    url : EB_Common.Ajax.wrapperUrl("/incidents/template/getAdvancedSearchItems"),
                    callback : {
                        search : function(conditions){
                        	
                        	var str = EB_Common.json.stringify(conditions);
                            $("#templates_gridTable").jqGrid('clearGridData');
                            $("#templates_gridTable").jqGrid('setGridParam', {postData: {conditions : str}, page: 1}).trigger('reloadGrid');
                        },
                        close:function(){
                        	 $("#templates_gridTable").jqGrid('clearGridData');
                             $("#templates_gridTable").jqGrid('setGridParam', {postData: {conditions : ""}, page: 1}).trigger('reloadGrid');
                        }
                     }
                });
                 //advanceSearch_incident
                $('#advanceSearch_templates').click(function(e) {
                    e.preventDefault();
                    me.advancedSearch_templates.load('ajax_advancedSearch_templates');
                });
            }
            $('#templates_gridTable').jqGrid({
                url: url,
                datatype: 'json',
                mtype: 'get',
                contentType: 'application/json',
                autoencode: false,
                emptyDataCaption: i18n['global.grid.emptyDataCaption'],
                jsonReader: {
                    root: 'data',
                    page: 'currentPageNo',
                    total: 'totalPageCount',
                    records: 'totalCount',
                    repeatitems: false
                },
                height: 'auto',
                autowidth: true,
                viewrecords: true,
                rowNum:	25,
                pager: '#templates_gridPager',
                scrollOffset: 0,
                multiselect: true,
                multiselectWidth: 40,
                prmNames: {
                    page: 'pageNo',
                    totalrows: 'totalrows'
                },
                colNames: [i18n['contact.field.id'],
                    '',
                    i18n['global.status'],
                    i18n['setting.topic.subscriptionFields.name'],
                    i18n['incidenttemplate.column.category']],
                colModel: [{
                        name: 'id',
                        index: 'id',
                        hidden: true
                    }, {name: 'id', index: 'id', width: 60, align: "left", sortable: false, formatter: function(value, rec, rowObject) {
                            var result = '<a class="icn_edit_16" title="' + i18n['button.update'] + '"  href="'+ me.pageContext +'/incidents/template?id=' + rowObject.id + '" recordId="' + rowObject.id + '"></a>' +
                                    '<a class="icn_copy_16" title="' + i18n['button.copy'] + '" name="gdTemplateCopy"  href="javascript:void(0);" recordName="'+rowObject.name+'" recordId="' + rowObject.id + '"></a>';
                            return result;
                        }
                    }, {
                        name: 'incidentStatus',
                        index: 'incidentStatus',
                        width: 60,
                        sorttype: 'int',
                        formatter: function(val, rec, rowObject) {
                            retValue = '<span class="gray_bg2">' + val + '</span>';
                            if (val == 'Draft')
                                retValue = '<span>' + val + '</span>';
                            return retValue;

                        }
                    }, {
                        name: 'name',
                        index: 'name',
                        width: 100,
                        formatter:function(val,rec,rowObject){
		                    return '<a name="gdTemplateView" recordId="'+rowObject.id+'"  href="javascript:void(0)">'+ $.jgrid.htmlEncode(val)+'</a>';
		                }
                    }, {
                        name: 'incidentCategory',
                        index: 'incidentCategory',
                        sorttype: 'text',
                        width: 80,
                        formatter: function(val, rec, rowObject) {
                            if(!val) return "";
                            var val1 = (val.name=="")?"---":$.jgrid.htmlEncode(val.name);
                            var retStr = '<a href="#" name="folderSelect" categoryId="'+val.id+'" class="b-incidents-normal"><span recordId="'+rowObject.id+'">' + val1 + '</span><i class="icon_gray_downarrow"></i></a>';
                            return retStr;
                        }

                    }],
                onSelectAll: function(aRowids, status) {
                    if (aRowids && aRowids.length > 0 && status) {
                        $('[name="deleteTemplates"]', '#' + id).removeAttr('disabled').removeClass('btn_disabled');
                        $('[name="deleteTemplates"] i', '#' + id).removeClass('icn_gray');
                    } else {
                        $('[name="deleteTemplates"]', '#' + id).attr('disabled', true).addClass('btn_disabled');
                        $('[name="deleteTemplates"] i', '#' + id).addClass('icn_gray');
                    }
                },
                onSelectRow: function(rowid, status) {
                    if (status) {
                        $('[name="deleteTemplates"]', '#' + id).removeAttr('disabled').removeClass('btn_disabled');
                        $('[name="deleteTemplates"] i', '#' + id).removeClass('icn_gray');
                    } else {
                        var selr = $('#templates_gridTable').jqGrid('getGridParam', 'selarrrow');
                        if (!selr || selr.length == 0) {
                            $('[name="deleteTemplates"]', '#' + id).attr('disabled', true).addClass('btn_disabled');
                            $('[name="deleteTemplates"] i', '#' + id).addClass('icn_gray');
                        }
                    }
                },
                initVariableTemplate:function(a){
                	var obj = {},b = a&&a.phaseTemplates&&a.phaseTemplates[0]&&a.phaseTemplates[0].formTemplate&&a.phaseTemplates[0].formTemplate,c = a&&a.phaseTemplates&&a.phaseTemplates[0]&&a.phaseTemplates[0].broadcastTemplate&&a.phaseTemplates&&a.phaseTemplates[0].broadcastTemplate.broadcastSettings&&a.phaseTemplates[0].broadcastTemplate.broadcastSettings;
                	obj.from =  c&&c.senderEmail||"";
                	obj.callerId = c&&c.senderCallerInfos&&c.senderCallerInfos[0]&&c.senderCallerInfos[0].callerId||"";
                	obj.title = b&&b.subject||"";
                	obj.premessage = b&&b.preMessage||"";
                	obj.bodyItems = b&&b.formVariableItems||[];
                	obj.postmessage = b&&b.postMessage||"";
                	
                	me.dataobj = obj;
                	//inputform
                	$("#initVariableTemplateBox").empty();
                	$("#initVariableTemplateBox").append($("#variableTemplate").render(obj.bodyItems));
                	
                	$("#initVariableMsessageBox").empty();
                	$("#initVariableMsessageBox").append($("#incident_variables_message_tmpl").render(obj));
                },
                
                loadComplete: function(respData) {
                    if(respData.data && respData.data.length > 0){
                        $('#templates_grid').css('width','50%').show();
                        $('#template_edit_ct').show();
                    }else{
                        $('#templates_grid').css('width','100%').show();
                        $('#template_edit_ct').hide();
                        $('#templates_gridTable').jqGrid('resizeGrid');
                    }
                   
                },
                gridComplete: function() {
                	//action for click of template name links                
                	var t = this;
	            	$('[name="gdTemplateView"]', '#' + id).click(function(e){
	            		e.preventDefault();
	            		var el = $(this);
	            		var id=el.attr('recordId');

	            		EB_Common.Ajax.ajax({
	    		        	url:EB_Common.Ajax.wrapperUrl("/incidents/template/")+id,
	    		        	type: "get",
	    		        	dataType: "json",	    		        	
	    			        success:function(data) {
	    			        	tmpjsonData = data;
	    			        	$("#lbl_templatename").text(tmpjsonData.name);
	    			        	$("#lbl_createOn").text(tmpjsonData.strCreatedDate);
	    			        	$("#lbl_updateOn").text(tmpjsonData.strLastModifiedDate);
	    			        	$("#lbl_updateBy").text(tmpjsonData.lastModifiedName);
	    			        	$("#lbl_status").text(i18n['incidenttemplate.status.'+tmpjsonData.incidentStatus.toLowerCase()]);
	    			        	$("#btn_changeStatus").text(i18n['button.new.'+tmpjsonData.incidentStatus.toLowerCase()]);
	    			        	//update className to hover
	    			        	//faild??? ;-(
	    			        	$("#"+id).className="ui-state-hover";
	    			        	t.p.initVariableTemplate(tmpjsonData);
	    			        	
	    			        }});
	            	});//.eq(0).click();
	            	//click copy
	            	$('[name="gdTemplateCopy"]', '#' + id).click(function(e){
	            		e.preventDefault();
	            		var el = $(this);
	            		var id=el.attr('recordId');
	            		var name = el.attr("recordName");
	            		me.copyIncidentTemplate(id,name);

	            	});

                    $('[name="folderSelect"]', '#' + id).click(function(e) {
                        //create folderSelectCt and init event
                        if($('#folderSelectCt').length == 0){
                             $('<ul id="folderSelectCt" class="b-indident-select-ct" style="display: none;">').appendTo(document.body);
                             $('#folderSelectCt').on('click', 'a', function(e) {
                                var el = $(this),
                                    ul = el.closest('ul'),
                                    id = $('#folderSelectCt').attr('recordId');

                                if (el.attr('manage')) {
                                    me.loadManageCategories(ul);
                                } else {
                                    var categoryId = el.attr("categoryId");
                                    if (categoryId) {
                                        EB_Common.Ajax.ajax({
                                            url: EB_Common.Ajax.wrapperUrl("/incidents/template/updateCategory"),
                                            type: "POST",
                                            dataType: "json",
                                            data: {"template_id": id, "category_id": categoryId},
                                            success: function(data) {
                                                tmpjsonData = {};
                                                var queryString = encodeURIComponent($("#searchName_template").val());
                                                $("#templates_gridTable").jqGrid('setGridParam', {postData: {queryString: queryString}, page: 1}).trigger("reloadGrid");
                                            }});
                                        //folderSelect.text(text);
                                    }
                                }
                                ul.hide();
                                return false;
                            });
                        }

                        var el = $(this),
                            offset = el.offset(),
                            height = el.height(),
                            selCategoryId = el.attr("categoryId"),
                            recordId = el.children('span').attr('recordId');
                        $('#folderSelectCt').hide().attr('recordId', recordId);
                        EB_Common.Ajax.ajax({
                            url: EB_Common.Ajax.wrapperUrl("/incidents/category/list"),
                            type: "GET",
                            dataType: "json",
                            async: false,
                            success: function(data) {
                                var liTmpl = "";
                                var ctId, ctName, title;
                                for (var i = 0; i < data.length; i++) {
                                    ctId = data[i].id;
                                    ctName = data[i].name;
                                    if(ctName.length > 30){
                                        title = ctName;
                                        ctName = ctName.substring(0, 20) + '...';
                                    }else{
                                        title = null;
                                    }
                                    if (ctId != selCategoryId) {
                                        liTmpl += '<li class="nowrap"><a href="#" categoryId="' + ctId + '"' + (title ? 'title="' + title + '"': '') + '>' + ctName + '</a></li>';
                                    }
                                }
                                if (selCategoryId != -1) {
                                    liTmpl += '<li class="nowrap"><a class="manage" href="#" categoryId="-1">' + i18n['incidenttemplate.category.nocategory'] + '</a></li>';
                                }
                                liTmpl += '<li class="nowrap"><a class="manage" manage="true" href="#">' + i18n['incidenttemplate.category.Manage'] + '</a></li>';

                                var folderSelectCt = $('#folderSelectCt');
                                folderSelectCt.empty().append(liTmpl);
                                var folderCtH = folderSelectCt.height();
                                var top = offset.top + height + 5;
                                if(offset.top + folderCtH > EB_Common.Element.getViewportHeight()){
                                    top = offset.top - folderCtH - height;
                                }
                                folderSelectCt.css({left: offset.left, top: top}).show();
                            }});
                        return false;
                    });

                  //click the first row when load complete
	            	var anArr = $('[name="gdTemplateView"]');
	            	if(anArr.length>0) {
	            		anArr[0].click();
	            	}
	            	me.checkLiveTemplate();

                }

            });

            var tmpjsonData={};
			$("#btn_changeStatus").click(function(e){
	            e.preventDefault();
	            if (tmpjsonData==null)
	            	return;
	        	var id=tmpjsonData.id;
	        	var status = (tmpjsonData.incidentStatus=="Draft")?"Live":"Draft";
        		EB_Common.Ajax.ajax({
		        	url:EB_Common.Ajax.wrapperUrl("/incidents/template/updateStatus"),
		        	type: "GET",
		        	dataType: "json",
		        	data:{"id":id,"status":status},
		        	async:false,
			        success:function(data) {
			        	 me.checkLiveTemplate();
			        	 tmpjsonData={};
			        	 var queryString=encodeURIComponent($("#searchName_template").val());
				         $("#templates_gridTable").jqGrid('setGridParam',{postData:{queryString:queryString},page:1}).trigger("reloadGrid");
				         
			        }});

	        });
			
            $("#searchTemplate").click(function(e) {
                e.preventDefault();
                me.quickSearchTemplates();
            });
            
            $("#searchName_template").keyup(function(e) {            	
                e.preventDefault();
                if(e.keyCode==13) {
                	me.quickSearchTemplates();
                }               
            });


            $("#resetTemplate").click(function(e) {
                e.preventDefault();
                $("#searchName_template").val("");
                $("#templates_gridTable").jqGrid('setGridParam', {postData: {queryString: ""}, page: 1}).trigger("reloadGrid");
            });

            $('[name="deleteTemplates"]', '#' + id).click(function(e) {
            	 e.preventDefault();
            	if ($(this).hasClass('btn_disabled')) {
                    return;
                }
            	   var selr = $('#templates_gridTable').jqGrid('getGridParam', 'selarrrow');
                   if (selr.length == 0) {
                       return false;
                   }

               	EB_Common.Ajax.ajax({
		        	url:EB_Common.Ajax.wrapperUrl("/incidents/template/checkReference"),
		        	type: "POST",
		        	data:{"ids":selr},
		        	async:false,
			        success:function(data) {
			        	//no open incidents are using candidate templates, we can remove it.
			        	 if(data.jsonStatus=="") {
			        		 var queryString=encodeURIComponent($("#searchName_template").val());
			        		 EB_Common.dialog.confirm(function() {
			        			 EB_Common.Ajax.remove('/incidents/template/delete?version=' + new Date().getMilliseconds() + Math.random(), {ids: selr}, function() {
			        				 $("#templates_gridTable").jqGrid('setGridParam',{postData:{queryString:queryString},page:1}).trigger("reloadGrid");
                               }, null, 'json');
                               $(this).dialog("close");
                           }, function() {
                        	   	return;
                           	 }
			                 );			                
			        	 }
			        	 else {
			        		 EB_Common.dialog.alert(i18n['incidenttemplate.delete.checkreference']+"<br/>"+data.jsonStatus,null,null);
			        	 }

			        }});

            });

        },
        quickSearchTemplates:function(){
        	 var queryString = encodeURIComponent($("#searchName_template").val());
             $("#templates_gridTable").jqGrid('setGridParam', {postData: {queryString: queryString}, page: 1}).trigger("reloadGrid");
        },
        //copy Incident Template
        copyIncidentTemplate: function(id,name) {
            var self = this;
            $("#templateName").removeData("previousValue");
            $("label.error").remove();
            $(".error").removeClass("error");
            if (!this.incidentTemplateOpen) {
                EB_Common.dialog.dialog('div_incidentTemplate_copy', {
                    autoOpen: false,
                    height: 'auto',
                    width: 'auto'
                }, function() {
                    if ($("#form_incidentTemplate_copy").valid()) {
                        $("#form_incidentTemplate_copy").submit();
                    } else {
                        return false;
                    }
                });

                this.incidentTemplateOpen = true;
                EB_Common.validation.validate("form_incidentTemplate_copy", {
                	onkeyup: false,
                    rules: {
                        name: {
                            remote: {
                                url: EB_Common.Ajax.wrapperUrl("/incidents/template/checkTemplateName"),
                                async: false,
                                type: "get",
                                data: {
                                    id: function() {
                                        return -1;//$("#incidentTemplate_id").val();
                                    },
                                    name: function() {
                                        return $("#templateName").val();
                                    }
                                }
                            }
                        }
                    },
                    messages: {
                        name: {
                            remote: i18n['setting.error.region.duplicatedName']
                        }
                    },
                    submitHandler: function(form) {
                        var options = {
                            url: EB_Common.Ajax.wrapperUrl("/incidents/template/copy"),
                            type: 'POST',
                            dataType: 'json',
                            success: function(data) {
                                $("#templates_gridTable").trigger("reloadGrid");
                            },
                            failure: function(data) {
                                console.info(data);
                            }
                        };

                        $('#form_incidentTemplate_copy').ajaxSubmit(options);
                    }
                });
            };

            $('#div_incidentTemplate_copy').dialog('open');

            var title = '', jsonData = {};
            title = ' ' + i18n['incidenttemplate.copy.title'];
            jsonData.id = id;
            jsonData.name = "Copy of "+name;

            $("#div_incidentTemplate_copy").dialog("option", "title", title);
            this.initIncidentTemplateName(jsonData);
        },

        initIncidentTemplateName: function(values) {
            var me = this;
            $('#templateName').val(values.name);
            $('#originalId').val(values.id);
        },

        loadIncidentVariables: function(url, tmplId) {
           /* $('#add_variable').show().siblings().hide();   */
            var id = tmplId.substring(0, tmplId.lastIndexOf('_'));
            var tab = $('#' + id);
            $('#tab_container').children().hide();
            if(tab.length > 0 ){
                tab.show();
                $("#variables_gridTable").jqGrid('resizeGrid');
                return;
            }
            $('#tab_container').append($('#' + tmplId).tmpl().attr('id', id));

            var me = this;
            $("#variables_gridTable").jqGrid({
                url: url,
                datatype: 'json',
                mtype: 'get',
                contentType: 'application/json',
                autoencode: false,
                emptyDataCaption: i18n['global.grid.emptyDataCaption'],
                jsonReader: {
                    root: 'data',
                    page: 'currentPageNo',
                    total: 'totalPageCount',
                    records: 'totalCount',
                    repeatitems: false
                },
                height: 'auto',
                autowidth: true,
                viewrecords: true,
                pager: '#variables_gridPager',
                scrollOffset: 0,
                multiselect: true,
                multiselectWidth: 40,
                prmNames: {
                    page: 'pageNo',
                    totalrows: 'totalrows'
                },
                colNames: [i18n['contact.field.id'],
                    '',
                    i18n['setting.topic.subscriptionFields.name'],
                    i18n['variable.type'],
                    i18n['variable.options']],
                colModel: [{
                        name: 'id',
                        index: 'id',
                        hidden: true
                    }, {name: 'id', index: 'id', width: 15, align: "center", sortable: false, formatter: function(value, rec, rowObject) {
                            var result = '<a class="icn_edit_16 edit_record" title="' + i18n['button.update'] + '"  href="#" recordId="' + rowObject.id + '"></a>' +
                                    '<a class="icn_copy_16 copy_record" title="' + i18n['button.copy'] + '"  href="#" recordId="' + rowObject.id + '"></a>';
                            return result;
                        }
                    }, {
                        name: 'name',
                        index: 'name',
                        width: 130
                    }, {
                        name: 'varType',
                        index: 'varType',
                        width: 100,
                        formatter: function(value, options, rowObject) {
                            switch (value) {
                                case "Single":
                                    return i18n['variable.type.singleselection'];
                                case "Multiple":
                                    return i18n['variable.type.multiselection'];
                                case "Textbox":
                                    return i18n['variable.type.textbox'];
                                case "Textarea":
                                    return i18n['variable.type.textarea'];
                                case "Date":
                                    return i18n['variable.type.Date'];
                                default:
                                    return '';
                            }

                        }
                    }, {
                        name: 'variableOptions',
                        index: 'variableOptions',
                        formatter: function(value, options, rowObject) {
                            if (value == null) {
                                return '--';
                            } else {
                                var length = value.length;
                                var display = '';
                                for (var index = 0; index < length; index++) {
                                    var option = value[index];
                                    display += option.val + '<br>';
                                }
                                return display;
                            }

                        },
                        width: 80
                    }],
                loadComplete: function(data) {
                    $('a.edit_record', '#' + id).click(function(e) {
                        e.preventDefault();
                        me.createOrUpdateVariable('update', $(this).attr('recordId'));
                    });
                    $('a.copy_record', '#' + id).click(function(e) {
                        e.preventDefault();
                        me.createOrUpdateVariable('copy', $(this).attr('recordId'));
                    });
                },
                onSelectAll: function(aRowids, status) {
                    if (aRowids && aRowids.length > 0 && status) {
                        $('[name="deleteVariable"]', '#' + id).removeAttr('disabled').removeClass('btn_disabled');
                        $('[name="deleteVariable"] i', '#' + id).removeClass('icn_gray');
                    } else {
                        $('[name="deleteVariable"]', '#' + id).attr('disabled', true).addClass('btn_disabled');
                        $('[name="deleteVariable"] i', '#' + id).addClass('icn_gray');
                    }
                },
                onSelectRow: function(rowid, status) {
                    if (status) {
                        $('[name="deleteVariable"]', '#' + id).removeAttr('disabled').removeClass('btn_disabled');
                        $('[name="deleteVariable"] i', '#' + id).removeClass('icn_gray');
                    } else {
                        var selr = $('#variables_gridTable').jqGrid('getGridParam', 'selarrrow');
                        if (!selr || selr.length == 0) {
                            $('[name="deleteVariable"]', '#' + id).attr('disabled', true).addClass('btn_disabled');
                            $('[name="deleteVariable"] i', '#' + id).addClass('icn_gray');
                        }
                    }
                }
            });

            $("#searchVariable").click(function(e) {
                e.preventDefault();
                me.quickSearchVariable();
            });
            $("#searchName").keyup(function(e) {
            	 e.preventDefault();
            	 if(e.keyCode==13)
            		 me.quickSearchVariable();
            });
            //create variable
            $('#add_variable').click(function(e) {
                e.preventDefault();
                me.createOrUpdateVariable('create');
            });
            $('[name="deleteVariable"]', '#' + id).click(function(e) {
                if ($(this).hasClass('btn_disabled')) {
                    return;
                }
                var selr = $('#variables_gridTable').jqGrid('getGridParam', 'selarrrow'),msg = "";
                if (selr.length == 0) {
                    return false;
                } 
                EB_Common.dialog.confirm(i18n["incident.informationvariables.deleteMsg"], null, 
                        function() {
                            EB_Common.Ajax.remove('/incidents/variableItem/delete?version=' + new Date().getMilliseconds() + Math.random(), {ids: selr}, function() {
                                $("#variables_gridTable").trigger("reloadGrid");
                            }, null, 'json');
                            $(this).dialog("close");
                        }, function() {
                        	return;
                        }
                );
            });

        },
        quickSearchVariable:function(){
        	 var queryString = encodeURIComponent($("#searchName").val());
             $("#variables_gridTable").jqGrid('setGridParam', {postData: {queryString: queryString}, page: 1}).trigger("reloadGrid");
        },
        //create update copy variable
        createOrUpdateVariable: function(type, id) {
            var self = this;
            if (type == 'update') {
                this.variableUrl = EB_Common.Ajax.wrapperUrl("/incidents/variableItem/update") + "?_method=PUT";
            } else {
                this.variableUrl = EB_Common.Ajax.wrapperUrl("/incidents/variableItem/create");
            }
            $("#name").removeData("previousValue");
            $("label.error").remove();
            $(".error").removeClass("error");
            if (!this.variableOpen) {
                EB_Common.dialog.dialog('form_variables_tmpl', {
                    autoOpen: false,
                    width : 430,
                    height: 'auto'
                }, function() {
                    if ($("#form_variables").valid()) {
                        $("#form_variables").submit();
                    } else {
                        return false;
                    }
                });

                this.initVariableEvent();
                this.variableOpen = true;
                EB_Common.validation.validate("form_variables", {
                	onkeyup: false,
                    rules: {
                        name: {
                            remote: {
                                url: EB_Common.Ajax.wrapperUrl("/incidents/variableItem/checkVariableName"),
                                async: false,
                                type: "post",
                                data: {
                                    id: function() {
                                        return $("#variableItemId").val();
                                    }
                                }
                            }
                        }
                    },
                    messages: {
                        name: {
                            remote: i18n['setting.error.region.duplicatedName']
                        }
                    },
                    submitHandler: function(form) {
                        var options = {
                            url: self.variableUrl,
                            type: 'POST',
                            dataType: 'json',
                            success: function(data) {
                                if (data) {
                                	$("#variables_gridTable").trigger("reloadGrid");
                                } else {
                                	EB_Common.dialog.alert(i18n['setting.error.resource.notExists'],null,null);
                                }
                            },
                            failure: function(data) {
                                console.info(data);
                            }
                        };
                        var reg = new RegExp("\\[x\\]", "gm");
                        $("#itemsContainer > li").each(function(n) {
                            $(this).find("input,select").each(function(i) {
                                var name = $(this).attr("name");
                                if (name) {
                                    if ($.browser.msie && ($.browser.version == "7.0"))   //is IE?
                                    {
                                        var dom1 = $(this)[0];
                                        dom1.name = name.replace(reg, "[" + n + "]");

                                    } else {
                                        $(this).attr("name", name.replace(reg, "[" + n + "]"));
                                    }
                                }
                            });
                        });
                        $('#form_variables').ajaxSubmit(options);
                    }
                });
            }
            var title = '',
                    jsonData = {};
            if (type == 'create') {
                title = i18n['incident.informationvariables.new'];
                jsonData.id = -1;
                $('#form_variables_tmpl').dialog('open');
                $("#form_variables_tmpl").dialog("option", "title", title);
                this.initVariableValue(jsonData, type);
            } else {
            	t = this;
                EB_Common.Ajax.ajax({
                    url: EB_Common.Ajax.wrapperUrl("/incidents/variableItem/") + id,
                    type: "get",
                    dataType: "json",
                    async: false,
                    success: function(data) {
                        if (data.success) {
                        	jsonData = data.item;
                        	if (type == 'update') {
                                title = i18n['incident.informationvariables.edit'];
                            } else {
                                title = i18n['incident.informationvariables.copy'];
                                jsonData.name = "Copy of " + jsonData.name;
                                jsonData.id = -1;
                            }
                        	title += ' ' + i18n['incident.informationvariables'];
                        	$('#form_variables_tmpl').dialog('open');
                            $("#form_variables_tmpl").dialog("option", "title", title);
                            t.initVariableValue(jsonData, type);
                        } else {
                        	EB_Common.dialog.alert(i18n['setting.error.resource.notExists'],null,null);
                        }
                    }
                });
            }
        },
        variableTemplate: {
            singleFieldItemTmpl: '<li><input class="margin5_R" type="radio" name="variableOptions[x].isSelected"><input type="text" name="variableOptions[x].val" class="{required:true}" maxlength="50" style="width:331px;"/>'
                    + '<a title="' + i18n['button.delete'] + '" href="javascript:void(0);" style="display:none;" class="icn_trash_16"></a></li>',
            multiFieldItemTmpl: '<li><input class="margin5_R" type="checkbox" name="variableOptions[x].isSelected"><input type="text" name="variableOptions[x].val" class="{required:true}" maxlength="50" style="width:331px;"/>'
                    + '<a title="' + i18n['button.delete'] + '" href="javascript:void(0);" style="display:none;" class="icn_trash_16"></a></li>',
            textareaTmpl: '<li><select name="rows" class="input_long"><option value="2">' + i18n['variable.options.short'] + '</option><option value="5">' + i18n['variable.options.medium'] + '</option><option  value="10">' + i18n['variable.options.long'] + '</option></select></li>',
            dateTmpl: '<li><select name="formatter" class="input_long"><option value="YY-MM-DD">' + i18n['variable.date.format1'] + '</option><option value="YY-MM-DD HH:MM:SS">' + i18n['variable.date.format2'] + '</option></select></li>'

        },
        initVariableValue: function(values, type) {
            var variableType = values.varType,
                    me = this,
                    itemsContainer = $('#itemsContainer');
            $('#variableType').val(variableType || 'Single').change();
            $('#variableType').attr("disabled", false);

            $('#name').val(values.name);
            $('#tooltip').val(values.tooltip);
            $('#variableItemId').val(values.id);

            var options = values.variableOptions;
            $('#optionLable').show();
            if (variableType == 'Single') {
                if (options == null) {
                    return;
                }
                itemsContainer.empty().show();
                $('#addItems').show();
                var length = options.length;
                for (var index = 0; index < options.length; index++) {
                    var option = options[index];
                    var li = $(me.variableTemplate.singleFieldItemTmpl);
                    li.find("input[type='radio']").attr("checked", option.isSelected);
                    li.find("input[type='text']").val(option.val);
                    itemsContainer.append(li);
                }
                this.showItemDelBtn();
            } else if (variableType == 'Multiple') {
                if (options == null) {
                    return;
                }
                itemsContainer.empty().show();
                $('#addItems').show();
                var length = options.length;
                for (var index = 0; index < options.length; index++) {
                    var option = options[index];
                    var li = $(me.variableTemplate.multiFieldItemTmpl);
                    li.find("input[type='checkbox']").attr("checked", option.isSelected);
                    li.find("input[type='text']").val(option.val);
                    itemsContainer.append(li);
                }
                this.showItemDelBtn();
            } else if (variableType == 'Textarea') {
                var option = values.extProperties;
                if (option == null) {
                    return;
                }
                itemsContainer.empty().show();
                $('#addItems').hide();
                var li = $(me.variableTemplate.textareaTmpl);
                li.find("select").val(option.rows);
                itemsContainer.append(li);
            } else if (variableType == 'Textbox') {
                $('#addItems').hide();
                itemsContainer.hide();
                $('#optionLable').hide();
            } else {
                var option = values.extProperties;
                if (option == null) {
                    return;
                }
                $('#addItems').hide();
                var li = $(me.variableTemplate.dateTmpl);
                li.find("select").val(option.formatter);
                itemsContainer.empty().show().append(li);
            }
        },
        showItemDelBtn: function() {
            var containerItems = $('#itemsContainer');
            if (containerItems.children('li').length == 2) {
                containerItems.find('a.icn_trash_16').hide();
            } else {
                containerItems.find('a.icn_trash_16').show();
            }
        },
        initVariableEvent: function() {
            var me = this;

            $('#variableType').change(function(e) {
                var value = $(this).val();
                $('#itemsContainer').empty();
                $('#optionLable').show();
                if (value == 'Single') {
                    $('#addItems').show();
                    $('#itemsContainer').show().append(me.variableTemplate.singleFieldItemTmpl).append(me.variableTemplate.singleFieldItemTmpl);//Default with two option inputs.
                    $('#itemsContainer').on('click', 'a.icn_trash_16', function(e) {
                        $(this).closest('li').remove();
                        me.showItemDelBtn();
                    });
                } else if (value == 'Multiple') {
                    $('#addItems').show();
                    $('#itemsContainer').show().append(me.variableTemplate.multiFieldItemTmpl).append(me.variableTemplate.multiFieldItemTmpl);//Default with two option inputs.
                    $('#itemsContainer').on('click', 'a.icn_trash_16', function(e) {
                        $(this).closest('li').remove();
                        me.showItemDelBtn();
                    });
                } else if (value == 'Textarea') {
                    $('#addItems').hide();
                    $('#itemsContainer').show().append(me.variableTemplate.textareaTmpl);
                } else if (value == 'Textbox') {
                    $('#addItems').hide();
                    $('#itemsContainer').hide();
                    $('#optionLable').hide();
                } else {
                    $('#addItems').hide();
                    $('#itemsContainer').show().append(me.variableTemplate.dateTmpl);
                }

                var inputs = $('#itemsContainer input[type="text"]');
                if (inputs.length > 0) {
                    inputs.rules('add', {
                        itemsduplicate: true
                    });
                }
            });

            $('#addItems').click(function(e) {
                var fieldItemTmpl;
                if ($('#variableType').val() == 'Single') {
                    fieldItemTmpl = me.variableTemplate.singleFieldItemTmpl;
                } else {
                    fieldItemTmpl = me.variableTemplate.multiFieldItemTmpl;
                }
                $(fieldItemTmpl).appendTo('#itemsContainer');
                me.showItemDelBtn();
            });

            /*$('#itemsContainer').on('mouseleave', 'input[type="text"]',function(){
             var inputs = $('#itemsContainer input:[type="text"]');
             inputs.each(function(index, element){
             $(element).valid();
             });
             });*/

        },
                
        loadManageCategories: function(ct) {
            var me = this;
            if (!this.manageCategories) {
                var el = $('<div id="manageCategories"/>').appendTo(document.body);
                $('#manageCategoriesForm').appendTo(el).show();
                EB_Common.dialog.dialog('manageCategories', {
                    title: 'Manage Categories',
                    autoOpen: false,
                    buttons: {
                        Ok: {
                            click: function() {
                               $(this).dialog("close");
                            },
                            'class': 'orange',
                            text: i18n['manage.phase.close']
                        }},
                    close : function(){
                        $('#categorieList').empty();
                        $('#addCategoryCt').hide();
                        me.categoriesEditable = true;
                    }
                });

                 // init manageCategoriesForm
                EB_Common.validation.validate('manageCategoriesForm');
                
                this.categoriesEditable = true;
                //Edit Category
                $('#categorieList').on('click', 'a.icn_edit_16', function(e) {
                    e.preventDefault();
                    if(me.categoriesEditable === false){
                        return;
                    }
                    var el = $(e.target),
                            textEl = el.siblings('span'),
                            cancelEl = el.siblings('a.icn_cancel_16'),
                            saveEl = el.siblings('a.icn_save_16'),
                            inputEl = el.siblings('input[name="category"]');

                    el.hide();
                    inputEl.show().val(textEl.text());
                    cancelEl.show();
                    saveEl.show();
                    textEl.hide();
                    me.categoriesEditable = false;
                });
                //Cancel Category
                $('#categorieList').on('click', 'a.icn_cancel_16', function(e) {
                    e.preventDefault();
                    var el = $(e.target),
                            textEl = el.siblings('span'),
                            editEl = el.siblings('a.icn_edit_16'),
                            saveEl = el.siblings('a.icn_save_16'),
                            inputEl = el.siblings('input[name="category"]');
                    el.hide();
                    inputEl.hide();
                    editEl.show();
                    saveEl.hide();
                    textEl.show();
                    me.categoriesEditable = true;
                });
                //Save Category
                $('#categorieList').on('click', 'a.icn_save_16', function(e) {
                    e.preventDefault();
                    var el = $(e.target),
                            textEl = el.siblings('span'),
                            editEl = el.siblings('a.icn_edit_16'),
                            cancelEl = el.siblings('a.icn_cancel_16'),
                            inputEl = el.siblings('input[name="category"]');

                    var categoryId = inputEl.attr("categoryid");
                    var categoryName = $.trim(inputEl.val());
                    if(!categoryId) return;
                    if(categoryName=="") return;
                    EB_Common.Ajax.ajax({
    		        	url:EB_Common.Ajax.wrapperUrl("/incidents/category/checkCategoryName"),
    		        	type: "POST",
    		        	data:{"id":categoryId,"name":categoryName},
    		        	async:false,
    			        success:function(data) {
    			        	if(data==true) {
			                    EB_Common.Ajax.ajax({
                                                url:EB_Common.Ajax.wrapperUrl("/incidents/category/update"),
                                                type: "POST",
                                                dataType: "json",
                                                data:{"id":categoryId,"name":categoryName},
                                                success:function(data) {
                                                        el.hide();
                                                        inputEl.hide();
                                                        editEl.show();
                                                        cancelEl.hide();
                                                        textEl.text(inputEl.val()).show();
                                                        $('#manageCategoriesForm').valid();
			         	    }});
    			        	} else {
    			        		EB_Common.dialog.alert(i18n['setting.error.region.duplicatedName'],null,null);
    			        	}
                                        me.categoriesEditable = true;
    			      }});

                });
 
                //Delete Category
                $('#manageCategoriesForm').on('click', 'a.icn_trash_16', function(e) {
                    e.preventDefault();
                    var el = $(e.target),
                        inputEl = el.siblings('input[name="category"]'),
                        remote = el.attr('remote'),
                        categoryId = inputEl.attr("categoryid"),
                        ids = [categoryId];
                    if(remote === 'false'){
                        var li = el.parent();
                        var lis = li.siblings();
                        li.remove();
                        lis.each(function(index, element){
                            $(element).find('.icn_trash_16')[lis.length > 1 ?  'show' : 'hide']();
                        });
                        $('#manageCategoriesForm').valid();
                        return;
                    }
                    if (ids.length > 0) {
                        EB_Common.dialog.confirm(i18n["incidenttemplate.delcategory.message"], null, function() {
                            EB_Common.Ajax.remove('/incidents/category/delete?version=' + new Date().getMilliseconds() + Math.random(), {ids: ids}, function() {
                                //me.listAllCategories();
                                el.parent().remove();
                                me.categoriesEditable = true;
                                $('#manageCategoriesForm').valid();
                            }, null, 'json');
                            $(this).dialog("close");
                        }, function() {
                            return;
                        }
                        );
                    }
                });
                
                $('#manageCategories a[name="addCategory"]').click(function(e) {
                    e.preventDefault();
                    //$('#itemsContainer_add').empty();
                    //$('#addCategorieItem').click();
                    $('#itemsContainer_add input[name="newcategory"]').val('');
                    $('#addCategoryCt').show();
                });
                
//                $('#addCategorieItem').click(function(e) {
//                    e.preventDefault();
//                    var ul = $('#itemsContainer_add');
//                    var liTmpl = '<li><input type="text" maxlength="80" class="input_short {required : true,elementsduplicate:[\'manageCategoriesForm\',\'input[name=\\\'category\\\'],input=[name=\\\'newcategory\\\']\']}" name="newcategory" categoryid="-1"><a class="icn_trash_16" href="#" title="Delete" remote="false"></a></li>';
//                    ul.append(liTmpl);
//                    var lis = ul.children();
//                    lis.each(function(index, element){
//                        $(element).find('.icn_trash_16')[lis.length > 1 ?  'show' : 'hide']();
//                    });
//                });
                
                $('#addCategorySubmit').click(function(e){
                    if(!$('#manageCategoriesForm').valid()){
                        return false;
                    }
                    var newinputs = $('input[name="newcategory"]');
                    if (!newinputs || newinputs.length == 0)
                        return;
                    var jsonstr = '';
                    for (var i = 0; i < newinputs.length; i++) {
                        if (jsonstr == '')
                            jsonstr += '{"id":-1,"name":"' + $.trim($(newinputs[i]).attr("value")) + '"}';
                        else
                            jsonstr += ',{"id":-1,"name":"' + $.trim($(newinputs[i]).attr("value")) + '"}';
                    }
                    if (jsonstr != "")
                        jsonstr = '[' + jsonstr + ']';
                    //alert(cts.length)
                    //alert(jsonstr)
                    if (jsonstr != "") {
                        EB_Common.Ajax.post(EB_Common.Ajax.wrapperUrl("/incidents/category/batchcreate"), {incidentCategoryJson: jsonstr}, function(data) {
                            $('#addCategoryCt').hide();
                            me.listAllCategories();
                        }, "json");

                    }
                });
                this.manageCategories = true;
            }

            $('#manageCategories').dialog('open');
            //add data
            this.listAllCategories();
        },
                
        time_To_dayhhmmss:function(seconds){
        	var day,hh,mm,ss;  
    	    if(seconds==null||seconds<0)
    	       return;
    	    day = seconds/3600/24|0;    	    
    	    seconds=parseInt(seconds)-(3600*day*24);
    	    hh=parseInt(seconds/3600)|0;
    	    seconds=parseInt(seconds)-hh*3600;    	      
    	    mm=seconds/60|0; 
    	    ss=parseInt(seconds)-mm*60; 
    	    return day+":"+hh+":"+mm+":"+ss;        	   
        },
        listAllCategories: function() {
            EB_Common.Ajax.ajax({
                url: EB_Common.Ajax.wrapperUrl("/incidents/category/list"),
                type: "GET",
                dataType: "json",
                async: false,
                success: function(data) {
                    var liTmpl = "";
                    var ctId, ctName;
                    for (i = 0; i < data.length; i++) {
                        ctId = data[i].id;
                        ctName = data[i].name;
                        liTmpl += '<li>\n\
                                    <input type="text" name="category" maxlength="80" class="{required : true,elementsduplicate:[\'categorieList\',\'input[name=\\\'category\\\'],input=[name=\\\'newcategory\\\']\']}" categoryid="' + ctId + '" value="' + ctName + '" style="display:none;"/> \n\
                                    <span class="margin5-R">' + ctName + '</span>\n\
                                    <a title="Edit" href="#" class="icn_edit_16"></a>\n\
                                    <a style="display:none;" title="Save" class="icn_save_16" href="#"></a>\n\
                                    <a style="display:none;" title="Cancel" class="icn_cancel_16" href="#"></a> \n\
                                    <a title="Remove" class="icn_trash_16" href="#"></a> \n\
                                   </li>';
                    }
                    $('#categorieList').empty().append(liTmpl);
                }});
        }
        

    };

    view.incidents.list = pub;

})(EB_View);
