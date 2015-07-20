/*
 * «Copyright 2011 José F. Maldonado»
 *
 *  This file is part of Histrix.
 *
 *  Histrix is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  Histrix is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with Histrix. If not, see <http://www.gnu.org/licenses/>.
 */

HistrixCalculator = new Object();

HistrixCalculator.stringDis = "0";
HistrixCalculator.numDis = 0;
HistrixCalculator.pila = new Array();

HistrixCalculator.lastNumAct = null;
HistrixCalculator.lastNumAnt = null;
HistrixCalculator.lastOp = null;

HistrixCalculator.mem = null;

HistrixCalculator.writingFlag = false;
HistrixCalculator.exponentialFlag = false;

HistrixCalculator.jquery = new Object();

HistrixCalculator.init = function()
	{
    // Get references    
    HistrixCalculator.jquery["select[name='base']"] = jQuery("#page_calculator select[name='base']");
    HistrixCalculator.jquery["select[name='metric']"] = jQuery("#page_calculator select[name='metric']");
    HistrixCalculator.jquery["select[name='range']"] = jQuery("#page_calculator select[name='range']");
    
    HistrixCalculator.jquery[".hexadecimal"] = jQuery("#page_calculator .hexadecimal");
    HistrixCalculator.jquery[".decimal"] = jQuery("#page_calculator .decimal");
    HistrixCalculator.jquery[".octal"] = jQuery("#page_calculator .octal");
    HistrixCalculator.jquery[".binary"] = jQuery("#page_calculator .binary");
    HistrixCalculator.jquery[".hexadecimal.hiddable"] = jQuery("#page_calculator .hexadecimal.hiddable");
    HistrixCalculator.jquery["a.button"] = jQuery("#page_calculator  a.button");

    HistrixCalculator.jquery["input.display"] = jQuery("#page_calculator input.display");
    HistrixCalculator.jquery["input[name='inv']"] = jQuery("#page_calculator input[name='inv']");
    HistrixCalculator.jquery["input[name='hyp']"] = jQuery("#page_calculator input[name='hyp']");
    HistrixCalculator.jquery["input[name='par']"] = jQuery("#page_calculator input[name='par']");
    HistrixCalculator.jquery["input[name='mem']"] = jQuery("#page_calculator input[name='mem']");
    
    // Store the content of the buttons in an attribute, in order to avoid call the 'html()' method each time that a button is pressed.
    HistrixCalculator.jquery["a.button"].each(function(index) {
        jQuery(this).attr("data-valor", jQuery(this).html());
    });
    
	// Change base.
	HistrixCalculator.jquery["select[name='base']"].change(function ()
		{
        var valor = jQuery(this).val();
        
        HistrixCalculator.jquery[".hexadecimal"].attr("disabled", true);
        HistrixCalculator.jquery[".hexadecimal"].css("color","#a0a0a0");
        HistrixCalculator.jquery[".decimal"].attr("disabled", true);
        HistrixCalculator.jquery[".decimal"].css("color","#a0a0a0");
        HistrixCalculator.jquery[".octal"].attr("disabled", true);
        HistrixCalculator.jquery[".octal"].css("color","#a0a0a0");
        HistrixCalculator.jquery[".binary"].attr("disabled", true);
        HistrixCalculator.jquery[".binary"].css("color","#a0a0a0");
        jQuery("#page_calculator ." + valor).removeAttr("disabled");
        jQuery("#page_calculator ." + valor).removeAttr("style");

        if(valor == 'hexadecimal') {
            HistrixCalculator.jquery[".hexadecimal.hiddable"].show();
        } else {
            HistrixCalculator.jquery[".hexadecimal.hiddable"].hide();
        }

        HistrixCalculator.display.update();
        HistrixCalculator.display.refresh();
        HistrixCalculator.numDis = HistrixCalculator.display.parse(HistrixCalculator.stringDis);
		});
	HistrixCalculator.jquery["select[name='base']"].change();


	// Buttons.
	HistrixCalculator.jquery["a.button"].click(function()
		{
		if(typeof jQuery(this).attr('disabled') == 'undefined' || jQuery(this).attr('disabled') == false || jQuery(this).attr('disabled') == 'false')
                    { HistrixCalculator.action(jQuery(this).attr('data-valor')); }
		return false;
		});


	// Display.
	HistrixCalculator.jquery["input.display"].get(0).onkeypress = function(event)
		{
		var keynum = HistrixCalculator.getKeyPress(event);
		var charCode = "";
		switch(keynum)
			{
			//case 8: charCode = "Backspace"; break;
			case 13:charCode = "=";break;
			default:charCode = String.fromCharCode(keynum);
			}

		HistrixCalculator.action(charCode);
		return false;
		};

	HistrixCalculator.jquery["input.display"].get(0).onkeyup = function(event)
		{
		var keynum = HistrixCalculator.getKeyPress(event);
		if(keynum == 8) {HistrixCalculator.action("Backspace");}
		return false;
		};

	HistrixCalculator.display.refresh();


	jQuery("#a_stats_load").click(function()
		{ 
		var option = jQuery("#select_statistics_datos option.stadistic_value:selected");
		if(jQuery(option).size() > 0)
			{
			HistrixCalculator.push( parseFloat(jQuery(option).attr('num')) );
			HistrixCalculator.display.refresh();
			}
		return false;
		});

	jQuery("#a_stats_cd").click(function()
		{
		jQuery("#select_statistics_datos option.stadistic_value:selected").remove();
        jQuery("#select_statistics_datos").selectmenu('refresh', true);
		return false;
		});

	jQuery("#a_stats_cad").click(function()
		{
		jQuery("#select_statistics_datos option.stadistic_value").remove();
        jQuery("#select_statistics_datos").selectmenu('refresh', true);
		return false;
		});
	};



// Get the key pressed by the user.
HistrixCalculator.getKeyPress = function(event)
	{
	var keynum;

	if(window.event) // IE
		{keynum = window.event.keyCode;}
	else
		if(event) // Chrome/Firefox/Opera
			{keynum = event.which;}

	return keynum;
	};



// Get the value of the 'Metric' selector.
HistrixCalculator.getMetric = function() {
    return HistrixCalculator.jquery["select[name='metric']"].val();
};

// Get the value of the 'Base' selector.
HistrixCalculator.getBase = function() {
    return HistrixCalculator.jquery["select[name='base']"].val();
};

// Get the value of the 'Range' selector.
HistrixCalculator.getRange = function() {
    return HistrixCalculator.jquery["select[name='range']"].val();
};



// Checks if the 'Inv' checkbox is checked.
HistrixCalculator.isInv = function()
	{ return HistrixCalculator.jquery["input[name='inv']"].is(":checked");};

// Checks or unchecks the 'Inv' checkbox.
HistrixCalculator.setInv = function(check)
	{ 
	if(check)
		{HistrixCalculator.jquery["input[name='inv']"].attr("checked",true).checkboxradio('refresh');;}
	else
		{HistrixCalculator.jquery["input[name='inv']"].removeAttr("checked").checkboxradio('refresh');;}
	};

// Checks if the 'Hyp' checkbox is checked.
HistrixCalculator.isHyp = function()
	{return HistrixCalculator.jquery["input[name='hyp']"].is(":checked");};

// Checks or unchecks the 'Hyp' checkbox.
HistrixCalculator.setHyp = function(check)
	{
	if(check)
		{HistrixCalculator.jquery["input[name='hyp']"].attr("checked",true).checkboxradio('refresh');;}
	else
		{HistrixCalculator.jquery["input[name='hyp']"].removeAttr("checked").checkboxradio('refresh');;}
	};



// An 'action' is produced when the user press a button or press a key.
HistrixCalculator.action = function(act)
	{
	// Update the numeric representacion of the display.
	HistrixCalculator.numDis = HistrixCalculator.display.parse(HistrixCalculator.stringDis);

	// Handle the action.
	HistrixCalculator.handleAction(act);

	// Refresh the display with the new value.
	HistrixCalculator.display.refresh();

	// Update the numeric representacion of the display.
	HistrixCalculator.numDis = HistrixCalculator.display.parse(HistrixCalculator.stringDis);

	// Update the display of parenthesis.
	var paren = HistrixCalculator.countOcurrences('(');
	if(paren == 0)
		{ HistrixCalculator.jquery["input[name='par']"].val(''); }
	else
		{ HistrixCalculator.jquery["input[name='par']"].val('(=' + paren); }

	// Put the focus on the display, so the user can press more keys.
	//jQuery("#HistrixCalculator input.display").focus();
	};



// Deletes the current number.
HistrixCalculator.clearDisplay = function()
	{
	HistrixCalculator.push(0);
	HistrixCalculator.numDis = 0;
	HistrixCalculator.stringDis = "0";
	}

// Deletes the current operation.
HistrixCalculator.clearAll = function()
	{
	HistrixCalculator.pila = new Array();
	HistrixCalculator.numDis = 0;
	HistrixCalculator.stringDis = "0"; 
	HistrixCalculator.lastNumAct = null;
	HistrixCalculator.lastNumAnt = null;
	HistrixCalculator.lastOp = null;
	};
