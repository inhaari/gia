/*



NOTE: 

*/

/*************************
 lobilist
 *************************/
$(function(){var t=function(t,e){this.$lobiList=t,this.$options=e,this.$globalOptions=t.$options,this.$items={},this._init()};t.prototype={$lobiList:null,$el:null,$elWrapper:null,$options:{},$items:{},$globalOptions:{},$ul:null,$header:null,$title:null,$form:null,$footer:null,$body:null,$hasGeneratedId:!1,storageObject:null,eventsSuppressed:!1,isStateful:function(){return!!this.$el.attr("id")&&this.$lobiList.storageObject},_init:function(){this.suppressEvents(),this.$options.id||(this.$options.id=this.$lobiList.getNextListId(),this.$hasGeneratedId=!0),this.$elWrapper=$('<div class="lobilist-wrapper"></div>'),this.$el=$('<div id="'+this.$options.id+'" class="lobilist"></div>').appendTo(this.$elWrapper),this.$hasGeneratedId||this.$el.attr("data-db-id",this.$options.id),this.isStateful()&&(this.$options.title=void 0===this.getSavedProperty("title")?this.$options.title:this.getSavedProperty("title"),this.$options.defaultStyle=void 0===this.getSavedProperty("style")?this.$options.defaultStyle:this.getSavedProperty("style")),this.$options.defaultStyle&&this.$el.addClass(this.$options.defaultStyle),this.$header=this._createHeader(),this.$title=this._createTitle(),this.$body=this._createBody(),this.$ul=this._createList(),this.$options.items&&this._createItems(this.$options.items),this.$form=this._createForm(),this.$body.append(this.$ul,this.$form),this.$footer=this._createFooter(),this.$globalOptions.sortable&&this._enableSorting(),this.resumeEvents()},getSavedProperty:function(t){return this.isStateful()?this.$lobiList.storageObject.getListProperty(this.$lobiList.getId(),this.getId(),t):(console.error("object is not stateful"),!1)},saveProperty:function(t,e){return this.isStateful()?this.$lobiList.storageObject.setListProperty(this.$lobiList.getId(),this.getId(),t,e):(console.error("object is not stateful"),!1)},addItem:function(t,e){var i=this;return!1===i._triggerEvent("beforeItemAdd",[i,t])?i:(t=i._processItemData(t),i.$globalOptions.actions.insert?$.ajax(i.$globalOptions.actions.insert,{data:t,method:"POST"}).done(function(s){s.success?(t.id=s.id,i._addItemToList(t)):e&&"function"==typeof e&&e(s)}):(t.id=i.$lobiList.getNextId(),i._addItemToList(t)),i)},updateItem:function(t,e){var i=this;return!1===i._triggerEvent("beforeItemUpdate",[i,t])?i:(i.$globalOptions.actions.update?$.ajax(i.$globalOptions.actions.update,{data:t,method:"POST"}).done(function(s){s.success?i._updateItemInList(t):e&&"function"==typeof e&&e(s)}):i._updateItemInList(t),i)},deleteItem:function(t,e){var i=this;return!1===i._triggerEvent("beforeItemDelete",[i,t])?i:i.$globalOptions.actions.delete?i._sendAjax(i.$globalOptions.actions.delete,{data:t,method:"POST"}).done(function(s){s.success?i._removeItemFromList(t):e&&"function"==typeof e&&e(s)}):(i._removeItemFromList(t),i)},saveOrUpdateItem:function(t,e){return t.id?this.updateItem(t,e):this.addItem(t,e),this},startTitleEditing:function(){var t=this._createInput();return this.$title.attr("data-old-title",this.$title.html()),t.val(this.$title.html()),t.insertAfter(this.$title),this.$title.addClass("hide"),this.$header.addClass("title-editing"),t[0].focus(),t[0].select(),this},finishTitleEditing:function(){var t=this.$header.find("input"),e=this.$title.attr("data-old-title");return this.$title.html(t.val()).removeClass("hide").removeAttr("data-old-title"),this.isStateful()&&this.saveProperty("title",t.val()),t.remove(),this.$header.removeClass("title-editing"),this._triggerEvent("titleChange",[this,e,t.val()]),this},cancelTitleEditing:function(){var t=this.$header.find("input");return 0===t.length?this:(this.$title.html(this.$title.attr("data-old-title")).removeClass("hide"),t.remove(),this.$header.removeClass("title-editing"),this)},remove:function(){return this.$lobiList.$lists.splice(this.$el.index(),1),this.$elWrapper.remove(),this},editItem:function(t){var e=this.$lobiList.$el.find("li[data-id="+t+"]"),i=e.closest(".lobilist").find(".lobilist-add-todo-form").removeClass("hide");e.closest(".lobilist").find(".lobilist-footer").addClass("hide");var s=e.data("lobiListItem");for(var o in s)i[0][o]&&(i[0][o].value=s[o]);return this},getPosition:function(){return this.$elWrapper.index()},getId:function(){return this.$options.id},setId:function(t){return this.$el.attr("id",t),this.$options.id=t,this.$el.attr("data-db-id",this.$options.id),this},getItemPositions:function(){var t={};return this.$el.find(".lobilist-item").each(function(e,i){var s=$(i);t[s.attr("data-id")]=s.index()+1}),t},getTitle:function(){return this.$title.html()},getStyle:function(){for(var t=this.$el[0].className.split(/\s+/),e=0;e<t.length;e++)if(this.$options.listStyles.indexOf(t[e])>-1)return t[e];return null},suppressEvents:function(){return this.eventsSuppressed=!0,this},resumeEvents:function(){return this.eventsSuppressed=!1,this},_processItemData:function(t){return t.listId=this.$options.id,$.extend({},this.$globalOptions.itemOptions,t)},_createHeader:function(){var t=$("<div>",{class:"lobilist-header"}),e=$("<div>",{class:"lobilist-actions"}).appendTo(t);return this.$options.controls&&this.$options.controls.length>0&&(this.$options.controls.indexOf("styleChange")>-1&&e.append(this._createDropdownForStyleChange()),this.$options.controls.indexOf("edit")>-1&&(e.append(this._createEditTitleButton()),e.append(this._createFinishTitleEditing()),e.append(this._createCancelTitleEditing())),this.$options.controls.indexOf("add")>-1&&e.append(this._createAddNewButton()),this.$options.controls.indexOf("remove")>-1&&e.append(this._createCloseButton())),this.$el.append(t),t},_createTitle:function(){var t=this,e=$("<div>",{class:"lobilist-title",html:t.$options.title}).appendTo(t.$header);return t.$options.controls&&t.$options.controls.indexOf("edit")>-1&&e.on("dblclick",function(){t.startTitleEditing()}),e},_createBody:function(){return $("<div>",{class:"lobilist-body"}).appendTo(this.$el)},_createForm:function(){var t=this,e=$("<form>",{class:"lobilist-add-todo-form hide"});$('<input type="hidden" name="id">').appendTo(e),$('<div class="form-group">').append($("<input>",{type:"text",name:"title",class:"form-control",placeholder:"TODO title"})).appendTo(e),$('<div class="form-group">').append($("<textarea>",{rows:"2",name:"description",class:"form-control",placeholder:"TODO description"})).appendTo(e),$('<div class="form-group">').append($("<input>",{type:"text",name:"dueDate",class:"form-control",placeholder:"Due Date"})).appendTo(e);var i=$('<div class="lobilist-form-footer">');return $("<button>",{class:"btn btn-primary btn-sm btn-add-todo",html:"Add"}).appendTo(i),$("<button>",{type:"button",class:"btn btn-default btn-sm btn-discard-todo",html:'<i class="fa fa-times-circle"></i>'}).click(function(){e.addClass("hide"),t.$footer.removeClass("hide")}).appendTo(i),i.appendTo(e),t._formHandler(e),t.$el.append(e),e},_formHandler:function(t){var e=this;t.on("submit",function(t){t.preventDefault(),e._submitForm()})},_submitForm:function(){if(this.$form[0].title.value){var t={};this.$form.find("[name]").each(function(e,i){t[i.name]=i.value}),this.saveOrUpdateItem(t),this.$form.addClass("hide"),this.$footer.removeClass("hide")}else this._showFormError("title","Title can not be empty")},_createFooter:function(){var t=this,e=$("<div>",{class:"lobilist-footer"});return $("<button>",{type:"button",class:"btn-link btn-show-form",html:"Add new"}).click(function(){t._resetForm(),t.$form.removeClass("hide"),e.addClass("hide")}).appendTo(e),t.$el.append(e),e},_createList:function(){var t=$("<ul>",{class:"lobilist-items"});return this.$el.append(t),t},_createItems:function(t){for(var e=0;e<t.length;e++)this._addItem(t[e])},_addItem:function(t){t.id||(t.id=this.$lobiList.getNextId()),!1!==this._triggerEvent("beforeItemAdd",[this,t])&&(t=this._processItemData(t),this._addItemToList(t))},_createCheckbox:function(){var t=this,e=$("<input>",{type:"checkbox"});return e.change(function(){t._onCheckboxChange(this)}),$("<label>",{class:"checkbox-inline lobilist-check"}).append(e)},_onCheckboxChange:function(t){var e=$(t),i=e.closest(".lobilist-item").data("lobiListItem");i.done=e.prop("checked"),i.done?this._triggerEvent("afterMarkAsDone",[this,i]):this._triggerEvent("afterMarkAsUndone",[this,i]),e.closest(".lobilist-item").toggleClass("item-done")},_createDropdownForStyleChange:function(){var t=this,e={type:"button","data-toggle":"dropdown",class:"btn btn-default btn-xs",html:'<i class="fa fa-th"></i>'},i={class:"dropdown"},s={class:"dropdown-menu dropdown-menu-right"};t.$options.forAngularJs&&(e["uib-dropdown-toggle"]="",i["uib-dropdown"]="",s["uib-dropdown-menu"]="");for(var o=$("<div>",i).append($("<button>",e)),n=$("<div>",s).appendTo(o),l=0;l<t.$globalOptions.listStyles.length;l++){var r=t.$globalOptions.listStyles[l];$('<div class="'+r+'"></div>').on("mousedown",function(t){t.stopPropagation()}).click(function(){for(var e=t.$el[0].className.split(" "),i=null,s=0;s<e.length;s++)t.$globalOptions.listStyles.indexOf(e[s])>-1&&(i=e[s]);t.$el.removeClass(t.$globalOptions.listStyles.join(" ")).addClass(this.className),t.saveProperty("style",this.className),t._triggerEvent("styleChange",[t,i,this.className])}).appendTo(n)}return o},_createEditTitleButton:function(){var t=this,e=$("<button>",{class:"btn btn-default btn-xs",html:'<i class="fa fa-pencil-square-o"></i>'});return e.click(function(){t.startTitleEditing()}),e},_createAddNewButton:function(){var t=this,e=$("<button>",{class:"btn btn-default btn-xs",html:'<i class="fa fa-plus"></i>'});return e.click(function(){t.$lobiList.addList().startTitleEditing()}),e},_createCloseButton:function(){var t=this,e=$("<button>",{class:"btn btn-default btn-xs",html:'<i class="fa fa-times"></i>'});return e.click(function(){t._onRemoveListClick()}),e},_onRemoveListClick:function(){return this._triggerEvent("beforeListRemove",[this]),this.remove(),this._triggerEvent("afterListRemove",[this]),this},_createFinishTitleEditing:function(){var t=this,e=$("<button>",{class:"btn btn-default btn-xs btn-finish-title-editing",html:'<i class="glyphicon glyphicon-ok-circle"></i>'});return e.click(function(){t.finishTitleEditing()}),e},_createCancelTitleEditing:function(){var t=this,e=$("<button>",{class:"btn btn-default btn-xs btn-cancel-title-editing",html:'<i class="fa fa-times-circle"></i>'});return e.click(function(){t.cancelTitleEditing()}),e},_createInput:function(){var t=this,e=$('<input type="text" class="form-control">');return e.on("keyup",function(e){13===e.which&&t.finishTitleEditing()}),e},_showFormError:function(t,e){var i=this.$form.find('[name="'+t+'"]').closest(".form-group").addClass("has-error");i.find(".help-block").remove(),i.append($('<span class="help-block">'+e+"</span>"))},_resetForm:function(){this.$form[0].reset(),this.$form[0].id.value="",this.$form.find(".form-group").removeClass("has-error").find(".help-block").remove()},_enableSorting:function(){var t=this;t.$el.find(".lobilist-items").sortable({connectWith:".lobilist .lobilist-items",items:".lobilist-item",handle:".drag-handler",cursor:"move",placeholder:"lobilist-item-placeholder",forcePlaceholderSize:!0,opacity:.9,revert:70,start:function(t,e){var i=e.item,s=i.closest(".lobilist");i.data("oldIndex",i.index()),i.data("oldList",s.data("lobiList"))},update:function(e,i){var s=i.item,o=s.data("lobiListItem"),n=s.data("oldList"),l=s.data("oldIndex"),r=s.index();t.$el.find(".lobilist-items").children().filter(function(){return this==s[0]}).length>0&&(t!=n&&(delete n.$items[o.id],t.$items[o.id]=o),t._triggerEvent("afterItemReorder",[t,n,r,l,o,s]))}})},_addItemToList:function(t){var e=$("<li>",{"data-id":t.id,class:"lobilist-item"});return e.append($("<div>",{class:"lobilist-item-title",html:t.title})),t.description&&e.append($("<div>",{class:"lobilist-item-description",html:t.description})),t.dueDate&&e.append($("<div>",{class:"lobilist-item-duedate",html:t.dueDate})),e=this._addItemControls(e),t.done&&(e.find("input[type=checkbox]").prop("checked",!0),e.addClass("item-done")),e.data("lobiListItem",t),this.$ul.append(e),this.$items[t.id]=t,this.isStateful()&&this.$lobiList.storageObject.addTodo(this.$lobiList.getId(),this.getId()),this._triggerEvent("afterItemAdd",[this,t]),e},_addItemControls:function(t){var e=this;e.$options.useCheckboxes&&t.append(e._createCheckbox());var i=$("<div>",{class:"todo-actions"}).appendTo(t);return e.$options.enableTodoEdit&&i.append($("<div>",{class:"edit-todo todo-action",html:'<i class="glyphicon glyphicon-pencil"></i>'}).click(function(){e.editItem($(this).closest("li").data("id"))})),e.$options.enableTodoRemove&&i.append($("<div>",{class:"delete-todo todo-action",html:'<i class="fa fa-times"></i>'}).click(function(){e._onDeleteItemClick($(this).closest("li").data("lobiListItem"))})),t.append($("<div>",{class:"drag-handler"})),t},_onDeleteItemClick:function(t){this.deleteItem(t)},_updateItemInList:function(t){var e=this.$lobiList.$el.find('li[data-id="'+t.id+'"]');e.find("input[type=checkbox]").prop("checked",t.done),e.find(".lobilist-item-title").html(t.title),e.find(".lobilist-item-description").remove(),e.find(".lobilist-item-duedate").remove(),t.description&&e.append('<div class="lobilist-item-description">'+t.description+"</div>"),t.dueDate&&e.append('<div class="lobilist-item-duedate">'+t.dueDate+"</div>"),e.data("lobiListItem",t),$.extend(this.$items[t.id],t),this._triggerEvent("afterItemUpdate",[this,t])},_triggerEvent:function(t,e){if(!this.eventsSuppressed)return this.$options[t]&&"function"==typeof this.$options[t]?this.$options[t].apply(this,e):void 0},_removeItemFromList:function(t){this.$lobiList.$el.find("li[data-id="+t.id+"]").remove(),this._triggerEvent("afterItemDelete",[this,t])},_sendAjax:function(t,e){return $.ajax(t,this._beforeAjaxSent(e))},_beforeAjaxSent:function(t){var e=this._triggerEvent("beforeAjaxSent",[this,t]);return $.extend({},t,e||{})}};var e=function(t,e){this.$el=t,this.init(e)};e.prototype={$el:null,$lists:[],$options:{},eventsSuppressed:!1,init:function(t){this.suppressEvents(),this.$options=this._processInput(t),this.$el.addClass("lobilists"),this.$options.onSingleLine&&this.$el.addClass("single-line"),this._createLists(),this._handleSortable(),this.resumeEvents(),this._triggerEvent("init",[this])},getId:function(){return this.$el.data("stateful-id")},_processInput:function(t){return(t=$.extend({},$.fn.lobiList.DEFAULT_OPTIONS,t)).actions.load&&$.ajax(t.actions.load,{async:!1,data:{name:t.name}}).done(function(e){t.lists=e.lists}),this.isStateful()&&!t.storageObject&&(this.storageObject=new function(){this.addList=function(t,e){console.log("TODO addList")},this.removeList=function(t,e){console.log("TODO removeList")},this.addTodo=function(t,e,i){console.log("TODO addTodod");var s=this.getLobilistStorage(e)||{};s.items=s.items||[],s.items.push()},this.removeTodo=function(t,e,i){console.log("TODO removeTodo")},this.saveItemPositions=function(t){console.log("TODO saveItemPositions")},this.saveListPositions=function(){console.log("TODO saveItemPositions")},this.setListProperty=function(t,e,i,s){var o=this.getListStorage(t,e);return o[i]=s,this.setListStorage(t,e,o)},this.getListProperty=function(t,e,i){var s=this.getLobilistStorage(t);if(s&&s.lists&&s.lists[e])return s.lists[e][i]},this.getLobilistStorage=function(t){return(this.getStorage()||{})[t]||{lists:{}}},this.setLobilistStorage=function(t,e){var i=this.getStorage()||{};return i[t]=e,this.setStorage(i)},this.getListStorage=function(t,e){return this.getLobilistStorage(t).lists[e]||{}},this.setListStorage=function(t,e,i){var s=this.getLobilistStorage(t);return s.lists=s.lists||[],s.lists[e]=i,this.setLobilistStorage(t,s)},this.getStorage=function(){return JSON.parse(localStorage.getItem("lobilist")||null)},this.setStorage=function(t){localStorage.setItem("lobilist",JSON.stringify(t||{}))}}),t},isStateful:function(){return!!this.getId()},_createLists:function(){for(var t=0;t<this.$options.lists.length;t++)this.addList(this.$options.lists[t]);return this},_handleSortable:function(){var t=this;return t.$options.sortable?t.$el.sortable({items:".lobilist-wrapper",handle:".lobilist-header",cursor:"move",placeholder:"lobilist-placeholder",forcePlaceholderSize:!0,opacity:.9,revert:70,start:function(t,e){var i=e.item;i.attr("data-previndex",i.index())},update:function(e,i){var s=i.item,o=s.find(".lobilist"),n=s.index(),l=parseInt(s.attr("data-previndex"));t._triggerEvent("afterListReorder",[t,o.data("lobiList"),n,l])}}):t.$el.addClass("no-sortable"),t},addList:function(e){return e instanceof t||(e=new t(this,this._processListOptions(e))),!1!==this._triggerEvent("beforeListAdd",[this,e])&&(this.$lists.push(e),this.$el.append(e.$elWrapper),e.$el.data("lobiList",e),this._triggerEvent("afterListAdd",[this,e])),e},destroy:function(){if(!1!==this._triggerEvent("beforeDestroy",[this])){for(var t=0;t<this.$lists.length;t++)this.$lists[t].remove();this.$options.sortable&&this.$el.sortable("destroy"),this.$el.removeClass("lobilists"),this.$options.onSingleLine&&this.$el.removeClass("single-line"),this.$el.removeData("lobiList"),this._triggerEvent("afterDestroy",[this])}return this},getNextId:function(){var t=0;return this.$el.find(".lobilist-item").each(function(e,i){var s=$(i);parseInt(s.attr("data-id"))>t&&(t=parseInt(s.attr("data-id")))}),t+1},getNextListId:function(){var t=0;return this.$el.find(".lobilist").each(function(e,i){var s=$(i).data("lobiList");0===s.getId().indexOf("lobilist-list-")&&parseInt(s.getId().replace("lobilist-list-"))>t&&(t=parseInt(s.getId().replace("lobilist-list-")))}),"lobilist-list-"+(t+1)},getListsPositions:function(){var t={};return this.$el.find(".lobilist-wrapper").each(function(e,i){var s=$(i).find(".lobilist").data("lobiList");t[s.getId()]=$(i).index()+1}),t},_processListOptions:function(t){t=$.extend({},this.$options.listsOptions,t);for(var e in this.$options)this.$options.hasOwnProperty(e)&&void 0===t[e]&&(t[e]=this.$options[e]);return t},suppressEvents:function(){return this.eventsSuppressed=!0,this},resumeEvents:function(){return this.eventsSuppressed=!1,this},_triggerEvent:function(t,e){if(!this.eventsSuppressed)return this.$options[t]&&"function"==typeof this.$options[t]?this.$options[t].apply(this,e):this.$el.trigger(t,e)}},$.fn.lobiList=function(t){var i=arguments;return this.each(function(){var s=$(this),o=s.data("lobiList"),n="object"==typeof t&&t;o||s.data("lobiList",o=new e(s,n)),"string"==typeof t&&(i=Array.prototype.slice.call(i,1),o[t].apply(o,i))})},$.fn.lobiList.DEFAULT_OPTIONS={name:null,listStyles:["lobilist-default","lobilist-danger","lobilist-success","lobilist-warning","lobilist-info","lobilist-primary"],listsOptions:{id:!1,title:"",items:[]},itemOptions:{id:!1,title:"",description:"",dueDate:"",done:!1},lists:[],actions:{load:"",update:"",insert:"",delete:""},storage:null,storageObject:null,useCheckboxes:!0,enableTodoRemove:!0,enableTodoEdit:!0,sortable:!0,controls:["edit","add","remove","styleChange"],defaultStyle:"lobilist-default",onSingleLine:!0,forAngularJs:!1,init:null,beforeDestroy:null,afterDestroy:null,beforeListAdd:null,afterListAdd:null,beforeListRemove:null,afterListRemove:null,beforeItemAdd:null,afterItemAdd:null,beforeItemUpdate:null,afterItemUpdate:null,beforeItemDelete:null,afterItemDelete:null,afterListReorder:null,afterItemReorder:null,afterMarkAsDone:null,afterMarkAsUndone:null,beforeAjaxSent:null,styleChange:null,titleChange:null}});



(function($){
  "use strict";
  $(function () {
      $('#lobilist-demo').lobiList({
          
          lists: [
        {
            title: 'TODO',
            defaultStyle: 'lobilist-info',
            items: [
                {
                    title: 'Floor cool cinders',
                    description: 'Thunder fulfilled travellers folly, wading, lake.',
                    dueDate: '2015-01-31'
                },
                {
                    title: 'Periods pride',
                    description: 'Accepted was mollis',
                    done: true
                },
                {
                    title: 'Flags better burns pigeon',
                    description: 'Rowed cloven frolic thereby, vivamus pining gown intruding strangers prank treacherously darkling.'
                },
                {
                    title: 'Accepted was mollis',
                    description: 'Rowed cloven frolic thereby, vivamus pining gown intruding strangers prank treacherously darkling.',
                    dueDate: '2015-02-02'
                }
            ]
        },
        {
            title: 'DOING',
            items: [
                {
                    title: 'Composed trays',
                    description: 'Hoary rattle exulting suspendisse elit paradises craft wistful. Bayonets allures prefer traits wrongs flushed. Tent wily matched bold polite slab coinage celerities gales beams.'
                },
                {
                    title: 'Chic leafy'
                },
                {
                    title: 'Guessed interdum armies chirp writhes most',
                    description: 'Came champlain live leopards twilight whenever warm read wish squirrel rock.',
                    dueDate: '2015-02-04',
                    done: true
                }
            ]
        }
    ]
  });
 
 $('#lobilist-demo-02').lobiList({
    lists: [
        {
            title: 'TODO',
            defaultStyle: 'lobilist-info',
            items: [
                {
                    title: 'Floor cool cinders',
                    description: 'Thunder fulfilled travellers folly, wading, lake.',
                    dueDate: '2015-01-31'
                }
            ]
        }
    ],
    afterListAdd: function(lobilist, list){
        var $dueDateInput = list.$el.find('form [name=dueDate]');
        $dueDateInput.datepicker();
    }
   });
 
  $('#lobilist-demo-03').lobiList({
   lists: [
        {
            title: 'TODO',
            defaultStyle: 'lobilist-info',
            controls: ['edit', 'styleChange'],
            items: [
                {
                    title: 'Floor cool cinders',
                    description: 'Thunder fulfilled travellers folly, wading, lake.',
                    dueDate: '2015-01-31'
                }
            ]
        },
        {
            title: 'Disabled custom checkboxes',
            defaultStyle: 'lobilist-danger',
            controls: ['edit', 'add', 'remove'],
            useLobicheck: false,
            items: [
                {
                    title: 'Periods pride',
                    description: 'Accepted was mollis',
                    done: true
                }
            ]
        },
        {
            title: 'Controls disabled',
            controls: false,
            items: [
                {
                    title: 'Composed trays',
                    description: 'Hoary rattle exulting suspendisse elit paradises craft wistful. ' +
                    'Bayonets allures prefer traits wrongs flushed. Tent wily matched bold polite slab coinage ' +
                    'celerities gales beams.'
                }
            ]
        },
        {
            title: 'Disabled todo edit/remove',
            enableTodoRemove: false,
            enableTodoEdit: false,
            items: [
                {
                    title: 'Composed trays',
                    description: 'Hoary rattle exulting suspendisse elit paradises craft wistful. ' +
                    'Bayonets allures prefer traits wrongs flushed. Tent wily matched bold polite slab coinage ' +
                    'celerities gales beams.'
                }
            ]
        }
    ]


   });
 
  $('#lobilist-demo-04').lobiList({
  sortable: false,
    lists: [
        {
            title: 'TODO',
            defaultStyle: 'lobilist-info',
            controls: ['edit', 'styleChange'],
            items: [
                {
                    title: 'Floor cool cinders',
                    description: 'Thunder fulfilled travellers folly, wading, lake.',
                    dueDate: '2015-01-31'
                }
            ]
        },
        {
            title: 'Controls disabled',
            controls: false,
            items: [
                {
                    title: 'Composed trays',
                    description: 'Hoary rattle exulting suspendisse elit paradises craft wistful. Bayonets allures prefer traits wrongs flushed. Tent wily matched bold polite slab coinage celerities gales beams.'
                }
            ]
        }
    ]
   });
 });

 })(jQuery);