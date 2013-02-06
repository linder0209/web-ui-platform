<%@ page language="java" contentType="text/html; charset=utf-8"
        pageEncoding="utf-8"%>
<%@ include file="/WEB-INF/commons/taglibs.jsp"%>
<link rel="stylesheet"
	href="${ctx }/statics/stylesheets/incidents/incidents.css?version=${util:getBuildInfo()}"
	type="text/css" />
<div id="subTop">
	<ul class="subtop_ul">
		<li><spring:message code="global.menu.tab.incidents" htmlEscape="false" /></li>
	</ul>
</div>
<div class="main_content">
	<div class="left create_btn" id="add_btns">
		<a class="button ebui-btn" href="${ctx }/incidents/incident/create" id="add_incident" style="display:block;visibility:hidden"><i class="icn_action_add"></i><spring:message code="button.new.incident" htmlEscape="false" /></a>
	</div>
	<div class="tab">
		<div id="main_tabs" class="tab_lst">
			<a id="ui-tabs-1" tmplId="all_incidents_tmpl" href="${ctx }/incidents/incident/list"><spring:message code="incident.tab.allincidents" htmlEscape="false" /> </a>
			<a id="ui-tabs-2" tmplId="incident_templates_tmpl" href="${ctx }/incidents/template/list"><spring:message code="incident.tab.incidenttemplates" htmlEscape="false" /> </a>
			<a id="ui-tabs-3" tmplId="incident_variables_tmpl" href="${ctx }/incidents/variableItem/list"><spring:message code="incident.informationvariables" htmlEscape="false" /> </a>
		</div>

		<div id="tab_container" class="tab_box"></div>
	</div>
</div>

<!-- templates -->
<!--  All Incidents  -->
<script id="all_incidents_tmpl" type="text/x-jquery-tmpl">
<div>
    <div id="ajax_advancedSearch_incidents">

    </div>
	
	<div class="clearfix">
		<div class="left margin10-T">
           <strong class="left margin5_R"><spring:message code="incident.filter.quick" htmlEscape="false" /></strong>
		   <ul class="b-incidents-list-tabs clearfix left" name="incidents_list_tabs">
		   		<li class="current" status="Open" id="liOpen"><spring:message code="incident.filter.open" htmlEscape="false" /> (<span id="spnNumOpen">0</span>) |</li>
		   		<li status="Closed" id="liClosed"><spring:message code="incident.filter.close" htmlEscape="false" /> (<span id="spnNumClosed">0</span>) |</li>
		   		<li status="" id="liAll"><spring:message code="incident.filter.all" htmlEscape="false" /> (<span id="spnNumAll">0</span>)</li>
		   </ul>
		</div>

		<div class="search right">
			<div class="search_div">
				<input type="text" id="searchName_incident" placeholder="Search" name="searchName_incident" class="name_input">
				<button id="searchIncidents" type="button" class="gbqfb">
					<span class="gbqfi"></span>
				</button>
			</div>
			<span class="left margin10-L"><a class="color_a" href="#"  id="advanceSearch_incident"> &gt;<spring:message code="button.addvanced.search" htmlEscape="false" /></a>&nbsp;&nbsp; <a
				class="color_a" href="javascript:void(0)"><spring:message code="user.list.reset" htmlEscape="false" /></a></span>

		</div>
	</div>

	<div class="jqgrid">
		<table id="incidents_gridTable"></table>
		<div id="incidents_gridPager"></div>
	</div>
</div>
</script>

<!--  All Incidents Templates-->
<script id="incident_templates_tmpl" type="text/x-jquery-tmpl">
<div>
    <div id="ajax_advancedSearch_templates">

    </div>
	<div class="clearfix">
		<div class="btndiv left">
			<div class="btn">
				<button disabled="disabled" name="deleteTemplates" type="button"
					class="button button-tbl btn_disabled gray">
					<i class="icn_gray"></i><spring:message code="button.delete" htmlEscape="false" />
				</button>
			</div>
            <a class="button button-tbl gray left margin50-L" href="${ctx }/incidents/template" id="add_template" style="display:block;"><i class="icn_action_add"></i> <spring:message code="button.new.incidenttemplate" htmlEscape="false" /></a>
		</div>

		<div class="search right">
			<div class="search_div">
				<input type="text" placeholder="Search" 
					name="searchName_template" class="name_input" id="searchName_template">
				<button type="button" class="gbqfb"  id="searchTemplate">
					<span class="gbqfi"></span>
				</button>
			</div>
			<span class="left margin10-L"><a class="color_a" href="#"  id="advanceSearch_templates"> &gt;<spring:message code="button.addvanced.search" htmlEscape="false" /></a>&nbsp;&nbsp; <a
				class="color_a" href="javascript:void(0)" id="resetTemplate"><spring:message code="user.list.reset" htmlEscape="false" /></a></span>
		</div>
	</div>
	<div class="clearfix">
		<div class="left jqgrid" style="width: 100%" id="templates_grid"  style="display:none;">
			<table id="templates_gridTable"></table>
			<div id="templates_gridPager"></div>
		</div>
		<div class="b-incidents-template-ct" id="template_edit_ct" style="display:none;height:auto">
		    <div style="height:100px;">
				<div class="left">
					<h4  id="lbl_templatename">Security Breach - Building</h4>
					<ul class="b-incidents-ul">
						<li><label class="label_a"><spring:message code="incidenttemplate.preview.createdon" htmlEscape="false" /> </label><span id="lbl_createOn">2012-10-30 3:21 PM PDT</span></li>
						<li><label class="label_a"><spring:message code="incidenttemplate.preview.lastupdated" htmlEscape="false" /></label> <span id="lbl_updateOn">2012-10-30 3:21 PM PDT</span></li>
						<li><label class="label_a"><spring:message code="incidenttemplate.preview.updateby" htmlEscape="false" /> </label><span id="lbl_updateBy">John Smith</span></li>
					</ul>
				</div>
				
				<div class="b-incidents-template-btn right text-center" >
					<span id="lbl_status"><spring:message code="incidenttemplate.status.live" htmlEscape="false" /></span>
					<div class="margin10-T">
						<button class="button button-tbl gray" type="button" id="btn_changeStatus">
                            <spring:message code="button.new.draft" htmlEscape="false" />
						</button>
					</div>
				</div>
			</div>
			
			<div>
                <div class="b-incidents-template-tabs preview" id="template_tabs">
					<label class="preview"><spring:message code="incidenttemplate.preview" htmlEscape="false" /></label>
					<a href="#" class="current" tab="inputForm"><spring:message code="incidenttemplate.preview.inputform" htmlEscape="false" /></a>
					<a href="#" tab="message"><spring:message code="incidenttemplate.preview.message" htmlEscape="false" /></a>
				</div>
				
				<div class="b-incidents-inputs-ct">
				    
					<div  id = "template_tabs_items">
						<dl class="b-incidents-inputs margin10-T" tabName="inputForm" id="initVariableTemplateBox">
						</dl>
                    	<div tabname="message" class="padding10" style="display: none;" id = "initVariableMsessageBox">
                                               
                    	</div>
					</div>
					<div class="margin10-L"  style="clear:both;">
						<input type="button" value="<spring:message code="button.new.test" htmlEscape="false" />" class="button orange" id="templateTest">
					</div>
				</div>
			</div>  
			  
		</div>
	</div>
</div>
</script>

<!-- Incident Template form (copy) Begin --> 
<div id="div_incidentTemplate_copy" style="display:none;padding:10px;height:100px;overflow:hidden;">
 <form:form id="form_incidentTemplate_copy" modelAttribute="incidentTemplate" action="">
 	<input type="hidden" id="originalId" name="originalId" />
	<dl class="b-incidents-inputs padding10">		
		<dt><spring:message code="setting.topic.subscriptionFields.name" htmlEscape="false" /><span class="xing">*</span></dt>
		<dd class="margin10-L">
			<input id="templateName" type="text" name="name" class="input_long {required:true}" maxlength="80">
		</dd>
	</dl>
 </form:form >
</div>				
<!-- Incident Template form (copy) end--> 
<script id="incident_variables_message_tmpl" type="text/x-jquery-tmpl">
<div id="bc_message_divview11" class="noti_content_div">
            <div><label class="bc_message_a1"><spring:message code="notification.title.messagetitle" htmlEscape="false" /></label></div>
			<div><span > <input type="text" key = 'title' class="formitem input_long  required v {maxlength:80}disabled" disabled maxlength="80" name="message.title" value = "{{:title}}"></span></div>
		
														<div>
                                                            <div><label><spring:message code="notification.title.body" htmlEscape="false" /></label> </div>
															<div><textarea key = 'premessage' class="formitem input_long disabled"  disabled  placeholder="">{{:premessage}}</textarea></div>
														</div>
                                                        <div class="noti_div_a select_long formarea">
																		{{for bodyItems}}

																			 <div class="clearfix">
           																		<label class="left" style="color:#333333">{{:variableName}}:</label>
          		 															 	<div class="txt_right">{{:val}}</div>
      																		 </div>
																		{{/for}}	
																
                                                                </span>
                                                        </div>
														<div>
															<textarea key = 'postmessage' class="formitem disabled input_long" disabled placeholder="">{{:postmessage}}</textarea>
														</div>
                                                </div>
                                                <div class="noti_content_div">
                                                        <div  id="polling_conference_containerview11">
                                                                <div class="dispaly_div" style="display: none;" id="poldivview11">
                                                                        <div class="div_clear padding8 gray_subdiv "
                                                                                id="pollingResponseDivview11">
                                                                                <label>Text Response<i class="xing">*</i></label> <a
                                                                                        href="javascript:void(0)" class="b-tooltip" tooltip="true"
                                                                                        tipcaption="&lt;strong&gt;Polling Response Help: To create a polling response, a text response must be created to track the recipient's response. Only one voice message will be created, comprised of all text responses. &lt;/strong&gt;For example: If you create text response press 1 for I Am Okay and text response, press 2 for I Need Help, you would then record one voice response 'press 1 for I Am OK, press 2 for I Need Help'"><i
                                                                                        class="icn_information_16"></i></a>
                                                                                <ul class="margin5-B" id="polling_answersview11">
                                                                                        <li class="polling_answer_span nowrap"><label>1</label> <input
                                                                                                type="text"
                                                                                                class="polling_answer width_percent80 required validate_field"
                                                                                                maxlength="250" name="message.questionaire.answers[0].name"
                                                                                                value=""> <i
                                                                                                class="icn_action_delete remove_polling_answer"
                                                                                                style="display: none;"></i></li>
                                                                                </ul>
                                                                        </div>
                                                                        <div>
                                                                                <a href="javascript:void(0)" id="add_polling_answerview11"><i
                                                                                        class="icn_addLink_12 margin5_R"></i><spring:message code="button.addother" htmlEscape="false" /></a>
                                                                        </div>
                                                                </div>
                                                                <div class="div_select_left" style="display: none;"
                                                                        id="confdivview11">
                                                                        <select style="width: 300px;" name="message.conferenceBridgeId"
                                                                                id="conferenceBridgeIdview11">
                                                                                <option value="8800387989509" selected="selected">Everbridge
                                                                                        Conference Bridge 1</option>
                                                                                <option value="8800387989510">Everbridge Conference Bridge
                                                                                        2</option>
                                                                                <option value="8800387989511">Everbridge Conference Bridge
                                                                                        3</option>
                                                                                <option value="8800387989512">Everbridge Conference Bridge
                                                                                        4</option>
                                                                                <option value="4402341478401">kevin bridge</option>
                                                                        </select> <span>If selected contacts exceed 96, the first 96 contacts
                                                                                will be reached</span>
                                                                </div>
                                                        </div>
                                                </div>
</script>

<!--  All Variables-->
<script id="incident_variables_tmpl" type="text/x-jquery-tmpl">
<div>
	<div class="clearfix">
		<div class="btndiv left">
			<div class="btn">
			    <button disabled="disabled" name="deleteVariable" id="deleteVariable"
					type="button"
					class="button button-tbl btn_disabled gray">
					<i class="icn_gray"></i><spring:message code="button.delete" htmlEscape="false" />
				</button>
                </div>
            <a class="button button-tbl gray left margin50-L" href="#" id="add_variable" style="display:block;"><i class="icn_action_add"></i> <spring:message code="button.new.variable" htmlEscape="false" /></a>
        </div>

		<div class="search right">
			<div class="search_div">
				<input type="text" placeholder="<spring:message code="button.search" htmlEscape="false" />"
					name="searchName" class="name_input" id ="searchName">
				<button  type="button" class="gbqfb" id="searchVariable">
					<span class="gbqfi"></span>
				</button>
			</div>
		</div>
	</div>
	<div class="jqgrid">
		<table id="variables_gridTable"></table>
		<div id="variables_gridPager"></div>
	</div>
</div>
</script>

<!-- Variables tmpl --> 
<div id="form_variables_tmpl" style="display:none;padding:10px;">
 <form:form id="form_variables" modelAttribute="variableItem" action="">
 	<input type="hidden" id="variableItemId" name="id" />
	<dl class="b-incidents-inputs padding10">
		<dt><spring:message code="setting.topic.subscriptionFields.topicCategoryType" htmlEscape="false" /></dt>
		<dd class="margin10-L">
			<select class="select_long" name="variableType" id="variableType">
				<option value="Single"><spring:message code="variable.type.singleselection" htmlEscape="false" /></option>
				<option value="Multiple"><spring:message code="variable.type.multiselection" htmlEscape="false" /></option>
				<option value="Textbox"><spring:message code="variable.type.textbox" htmlEscape="false" /></option>
                <option value="Textarea"><spring:message code="variable.type.textarea" htmlEscape="false" /></option>
				<option value="Date"><spring:message code="variable.type.Date" htmlEscape="false" /></option>
			</select>
		</dd>
		<dt><spring:message code="setting.topic.subscriptionFields.name" htmlEscape="false" /><span class="xing">*</span></dt>
		<dd class="margin10-L">
			<input id="name" type="text" name="name" class="input_long {required:true}" maxlength="30">
		</dd>
		<dt><spring:message code="variable.Tooltip" htmlEscape="false" /></dt>
		<dd class="margin10-L">
			<textarea name="tooltip" id="tooltip" maxlength="250"  class="input_long"></textarea>
		</dd>
		<dt id="optionLable"><spring:message code="variable.Options" htmlEscape="false" /><span class="xing">*</span></dt>
		<dd class="margin10-L">
			<ul id="itemsContainer" class="b-distance">
			</ul>
			<div>
				<a href="#" id="addItems"><i class="icn_addLink_12"></i> <spring:message code="button.add.another.items" htmlEscape="false" /></a>
			</div>
		</dd>
	</dl>
 </form:form >
</div>				
<!-- Variables tmpl end--> 

<script id="template_preview_tmpl" type="text/x-jquery-tmpl">
<div class="margin10">
    <div class="margin10_B">
        <label>FROM:</label>{{:from}}  <br>
        <label>CALLER ID:</label>{{:callerId}}
    </div>
    <h2 class="margin20-T margin10_B">{{:title}}</h2>
    <div class="formarea margin10_B">
        {{:premessage}}
    </div>
     <div class="formarea margin10_B" >
            {{for bodyItems}}
    <div><label>{{:variableName}}:</label>{{:val}}</div>
            {{/for}}
     </div>
     <div class="formarea" >
        {{:postmessage}}
     </div>
</div>
</script>

<script type="text/x-jsrender" id="variableTemplate">
 {{for #data}}
    <li id="{{:variableLiId}}" variableId="{{:variableId}}">
        <label class="index left" variableId="{{:variableId}}">{{if isRequired}}{{/if}}{{:seq}}</label>
        <label class="label_a" style="vertical-align:top">{{>variableName}}{{if isRequired}}<span class="xing">*</span>{{/if}}</label>
        {{if variableItem.varType=='Single'}}
        <select class="select_short select_long disabled"  disabled>
            {{for variableItem.variableOptions}}
            <option value="{{:val}}" {{if selected}}selected="selected"{{/if}}>{{>txt}}</option>
            {{/for}}
        </select>
        {{/if}}
        {{if variableItem.varType=='Multiple'}}
        <select multiple="multiple" class="select_long disabled" disabled>
            {{for variableItem.variableOptions}}
            <option value="{{:val}}" {{if selected}}selected="selected"{{/if}}>{{>txt}}</option>
            {{/for}}
        </select>
        {{/if}}
        {{if variableItem.varType=='Date'}}<input disabled inputDate="{{:variableItem.extProperties.formatter}}" type="text" value="{{:#parent.parent.data.val}}" class="input_long disabled"/>{{/if}}
        {{if variableItem.varType=='Textbox'}}<input disabled type="text" value="{{:#parent.parent.data.val}}" name="input" class="input_long disabled"/>{{/if}}
        {{if variableItem.varType=='Textarea'}}
        <textarea disabled name="input" class="disabled"> {{:#parent.parent.data.val}}</textarea>
        {{/if}}
    </li>
    {{/for}}

</script>

<form id="manageCategoriesForm" style="display: none;">
    <div><a href="#" class="button ebui-btn" name="addCategory"><i class="icn_action_add"></i> New Category</a></div>
    <div class="radius_border margin10-T padding10" id="addCategoryCt" style="display: none;">
        <ul id="itemsContainer_add" class="b-distance">
           <li>
               <input type="text" categoryid="-1" name="newcategory" class="input_short {required : true,elementsduplicate:['manageCategoriesForm','input[name=\'category\'],input=[name=\'newcategory\']']}" maxlength="80">
           </li>
        </ul>
        <!--<a href="#" id="addCategorieItem"><i class="icn_addLink_12"></i> Add another item</a>-->
        <div>
            <input type="button" id="addCategorySubmit" class="button orange margin5-R" value="Save">
        </div>
    </div>
    <div class="b-incidents-categories-ct margin10-B"><ul id="categorieList" class="b-incidents-categories"></ul></div>
</form>

<script
	src="${ctx }/statics/javascripts/plugin/jquery-jqgrid/js/grid.base.js?version=${util:getBuildInfo()}"
	type="text/javascript"></script>
<script type="text/javascript" src="${ctx }/statics/javascripts/plugin/jquery.tmpl.min.js?version=${util:getBuildInfo()}"></script>

<script src="${ctx }/statics/javascripts/everbridge/eb_advancedSearch.js?version=${util:getBuildInfo()}" type="text/javascript"></script>

<script type="text/javascript"
	src="${ctx }/statics/javascripts/views/incidents/incidents.js?version=${util:getBuildInfo()}"></script>

<script type="text/javascript">
	$(function() {
		EB_View.incidents.list.initPage('${ctx}');
	});
</script>
