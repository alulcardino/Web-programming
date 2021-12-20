var is_prompt = 0;
var must_step = 0;
var checker_name;
var checkers;
var taggeds = [];
var red_flag = false;
var last_vector = {x : 0, y : 0};
var step = 1;
var global_list = [];
var delete_list = [];
var is_win = 0;
var record = "";
var end_step = 1;

function begin() {
	document.getElementById("complete_button").disabled = true;
	document.getElementById("cansel_button").disabled = true;
	clear();
	checkers = [[0,2,0,2,0,2,0,2],
				[2,0,2,0,2,0,2,0],
				[0,2,0,2,0,2,0,2],
				[0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0],
				[1,0,1,0,1,0,1,0],
				[0,1,0,1,0,1,0,1],
				[1,0,1,0,1,0,1,0]];
	arrange();
	step = 1;
	take_step();
}

function example_first() {
	clear();
	checkers = [[0,2,0,0,0,0,0,0],
				[0,0,2,0,2,0,0,0],
				[0,0,0,0,0,0,0,2],
				[0,0,2,0,0,0,0,0],
				[0,0,0,0,0,1,0,1],
				[3,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0],
				[0,0,4,0,0,0,0,0]];
	arrange();
	step = 1;
	take_step();
}

function clear() {
	is_prompt = 0;
	var imgs = document.getElementsByClassName("field")[0].getElementsByTagName("img");
	for (var i = imgs.length - 1; i >= 0 ; i--) {
		imgs[i].remove();
	}
	for (var i = 0; i < 8; i++) {
		for(var j = 0; j < 8; j++) {
			document.
			getElementsByClassName("field")[0].
			getElementsByTagName("table")[0].
			rows[i + 1].
			getElementsByTagName("td")[j].
			style.
			cssText = ``;
		}
	}

	var rows = document.getElementById("record_table").rows;
	for (var i = rows.length - 1; i >= 1 ; i--) {
		rows[i].remove();
	}
}

function get_color(color) {
	var str = "";
	if(color == 2) {
    	str = "check_black";
	} else if(color == 1) {
		str = "check_white";
	} else if(color == 4) {
		str = "king_black";
	} else if(color == 3) {
		str = "king_white";
	}
	return str;
}

function arrange() {
	is_win = 0;
	for(var i = 0; i < 8; i++) {
		for(var j = 0; j < 8; j++) {
			if(checkers[i][j] != 0) {
				var checker = document.createElement("IMG");
				checker.setAttribute("src", "../images/" + get_color(checkers[i][j]) + ".png");
				const name = {x : 7-i, y : j};
				const color = checkers[i][j];
				checker.onclick = function() {choose(name, this, color);}
				document.getElementsByClassName("field")[0].getElementsByTagName("table")[0].rows[i + 1].getElementsByTagName("td")[j].appendChild(checker);
			}
		}
	}
}

function choose(name, checker, color) {
	if(is_prompt == 0 && step == (color + 1) % 2 && is_win != 1 && end_step != 0) {
		is_prompt = 1;
		checker_name = {x : name.x, y : name.y};
		checker.style.cssText = `padding: 0;
			border: 0px solid yellow;`;
		recalculation(name, checker, color, 0);
		delete_list.push({cell : checker, x : 8 - name.x, y : name.y, color : color});
		document.getElementById("complete_button").onclick = function() {complete_step(checker);}
		document.getElementById("cansel_button").onclick = function() {cansel_step(checker);}
	} else if(is_prompt == 1 && checker_name.x == name.x && checker_name.y == name.y && must_step == 0 && end_step != 0) {
		delete_list = [];
		is_prompt = 0;
		checker.style.cssText = "";
		clear_styles("all");
		red_flag = false;
	}
}

function recalculation(name, checker, color, state) {
	var k = 0;
	global_list.forEach(function(item, i, arr) {
	    if(name.x == item.x && name.y == item.y) {
	    	k++;
	    }
	});
	if(k == 0 && global_list.length != 0 && state == 0) {
		return false;
	}

	x = name.x + 8;
	y = name.y + 8;
	red_flag = false;
	for(var k = 0; k <= 8; k += 2) {
		if(k == 4) {
			continue;
		}
		var vec = {x : k % 3 - 1, y : Math.floor(k / 3) - 1};
		var i = x;
		var j = y;
		var block = 0;
		var enemy_x = 0;
		var enemy_y = 0;
		for(;i >= 8 && j >= 8 && i <= 15 && j <= 15;) {
			i += vec.x;
			j += vec.y;
			if(i >= 8 && j >= 8 && i <= 15 && j <= 15) {
				var dir = (color % 2) * 2 - 1;
				if(checkers[7-(i % 8)][j % 8] == 0 && block == 0) {
					if(i == x + dir || color > 2) {
						var cell = document.getElementsByClassName("field")[0].getElementsByTagName("table")[0].rows[7-(i % 8) + 1].getElementsByTagName("td")[j % 8];
						cell.style.cssText = "background-color: #1FCA40;";
						const new_name = {x : i - 8, y : j - 8};
						cell.onclick = function() {move(this, checker, new_name, 0, color, null);}
						taggeds.push({i : 7-(i % 8), j : j % 8, color : 0});
					}
				} else if(checkers[7-(i % 8)][j % 8] % 2 != checkers[7-(x % 8)][y % 8] % 2 && block == 0) {
					if((i == x + dir || i == x - dir || color > 2) 
						&& !(must_step == 1 && last_vector.x == -Math.sign(i-x) && last_vector.y == -Math.sign(j-y))) {
						block = 1;
						enemy_x = i;
						enemy_y = j;
					}
				} else if(checkers[7-(i % 8)][j % 8] == 0 && block == 1) {
					if(i == x + 2 || i == x - 2 || color > 2) {
						red_flag = true;
						var cell = document.getElementsByClassName("field")[0].getElementsByTagName("table")[0].rows[7-(i % 8) + 1].getElementsByTagName("td")[j % 8];
						cell.style.cssText = "background-color: #C70039;";
						const new_name = {x : i - 8, y : j - 8};
						const enemy_pos = {x : enemy_x - 8, y : enemy_y - 8};
						cell.onclick = function() {move(this, checker, new_name, 1, color, enemy_pos);}
						taggeds.push({i : 7-(i % 8), j : j % 8, color : 1});
					}
				} else if(checkers[7-(i % 8)][j % 8] != 0 && block == 1) {
					break;
				}
			}
		}
	}
	var flag = red_flag;

	if(red_flag) { clear_styles("without_red");}
	red_flag = false;
	return flag;
}

function clear_styles(priority) {
	var i = 0;
	while(i < taggeds.length) {
		if(priority == "without_red" && taggeds[i].color == 1) {
			i++;
			continue;
		}
		var cell = document.getElementsByClassName("field")[0].getElementsByTagName("table")[0].rows[taggeds[i].i + 1].getElementsByTagName("td")[taggeds[i].j];
		cell.style.cssText = "";
		taggeds.splice(i, 1);
		cell.onclick = "";
	}
}

function move(cell, checker, new_checker_name, enemy, color, enemy_pos) {
	end_step = 0;
	button_activate(0);
	cell.appendChild(checker);
	var chessboard_name = chessboard_projection(checker_name);
	var chessboard_new_name = chessboard_projection(new_checker_name);
	var new_color = color;
	last_vector.x = Math.sign(new_checker_name.x - checker_name.x);
	last_vector.y = Math.sign(new_checker_name.y - checker_name.y);
	checkers[7-checker_name.x][checker_name.y] = 0;
	if(new_color <= 2 && new_checker_name.x == 7 - 7*(new_color - 1)){
		new_color += 2;
		checker.setAttribute("src", "../images/" + get_color(new_color) + ".png");
	}
	checkers[7-new_checker_name.x][new_checker_name.y] = new_color;
	checker_name.x = new_checker_name.x;
	checker_name.y = new_checker_name.y;
	if(enemy == 0) {
		record += chessboard_name;
		record += "-";
		record += chessboard_new_name;
		clear_styles("all");
		//take_step(new_color);
		checker.onclick = function() {choose(new_checker_name, this, new_color);}
	} else {
		if(record == "") {
			record += chessboard_name;
		}
		record += ":";
		record += chessboard_new_name;

		must_step = 1;
		const const_color = checkers[7 - enemy_pos.x][enemy_pos.y];
		checkers[7 - enemy_pos.x][enemy_pos.y] = 0;
		clear_styles("all");
		checker.onclick = function() {choose(new_checker_name, this, new_color);}
		const copyname = {x : new_checker_name.x, y : new_checker_name.y};
		if(!recalculation(copyname, checker, new_color, 1)) {
			clear_styles("all");
			must_step = 0;
			//take_step(new_color);
		}
		var cell = document.getElementsByClassName("field")[0].getElementsByTagName("table")[0].rows[8 - enemy_pos.x].getElementsByTagName("td")[enemy_pos.y];
		while (cell.firstChild) {
			delete_list.push({cell : cell.firstChild, x : 8 - enemy_pos.x, y : enemy_pos.y, color : const_color});
		    cell.removeChild(cell.firstChild);
		}
	}
}

function take_step() {
	step = (step + 1) % 2;
	console.log(step);
	global_list.splice(0, global_list.length);
	var win = 0;
	for(var i = 0; i < 8; i++) {
		for(var j = 0; j < 8; j++) {
			var local_checker;
			var new_color = checkers[7-i][j];
			if(new_color != 0 && (new_color + 1) % 2 == step) {
				local_checker = document.getElementsByClassName("field")[0].getElementsByTagName("table")[0].rows[8 - i].getElementsByTagName("td")[j].getElementsByTagName("img")[0];			
				const name = {x : i, y : j};
				if(recalculation(name, local_checker, new_color, 1)) {
					global_list.push(name);
				}
				win += taggeds.length;
				clear_styles("all");
			}
		}
	}
	if(win == 0) {
		is_win = 1;
		var text_content = step == 0 ? "ЧЁРНЫХ" : "БЕЛЫХ" ;
		document.getElementsByClassName("step_text")[0].style.cssText = "color:#335d2d";
		document.getElementsByClassName("step_text")[0].textContent = "ПОБЕДА " + text_content;
	} else {
		var text_color = step == 0 ? "FFFFFF" : "000000";
		var text_content = step == 0 ? "БЕЛЫХ" : "ЧЁРНЫХ";
		document.getElementsByClassName("step_text")[0].style.cssText = "color:#" + text_color;
		document.getElementsByClassName("step_text")[0].textContent = "Ход " + text_content;
	}
}

function button_activate(active) {
	document.getElementById("complete_button").disabled = active;
	document.getElementById("cansel_button").disabled = active;
}

function complete_step(checker) {
	button_activate(1);
	var tbody = document.getElementById("record_table");
	end_step = 1;
	is_prompt = 0;
	checker.style.cssText = "";
	if(step == 0) {
	    var row = document.createElement("TR");
	    var td1 = document.createElement("TD");
	    td1.appendChild(document.createTextNode(record));
	    var td2 = document.createElement("TD");
	    row.appendChild(td1);
	    row.appendChild(td2);
	    tbody.appendChild(row);
	} else {
		var lastRow = tbody.rows.length - 1;
		var td2 = document.getElementById("record_table").rows[lastRow].getElementsByTagName("TD")[1];
		td2.appendChild(document.createTextNode(record));
	}
	record = "";
	delete_list = [];
	take_step();
}

function cansel_step(checker) {
	button_activate(1);
	record = "";
	end_step = 1;
	is_prompt = 0;
	checker.style.cssText = "";
	for(var i = 0; i < delete_list.length; i++) {
		var cell =  document.getElementsByClassName("field")[0].getElementsByTagName("table")[0].rows[delete_list[i].x].getElementsByTagName("td")[delete_list[i].y];
		cell.appendChild(delete_list[i].cell);
		var old = cell.firstChild;
		const new_checker_name = {x : 8-delete_list[i].x, y : delete_list[i].y};
		const new_color = delete_list[i].color;
		old.onclick = function() {choose(new_checker_name, this, new_color);}
		console.log(delete_list[i].color);
		checkers[delete_list[i].x - 1][delete_list[i].y] = new_color;
	}
	checkers[7-checker_name.x][checker_name.y] = 0;
	checker_name.x = 8-delete_list[0].x;
	checker_name.y = delete_list[0].y;
	const new_color = delete_list[0].color;
	const new_checker_name = {x : checker_name.x, y : checker_name.y};
	checker.onclick = function() {choose(new_checker_name, this, new_color);}
	checker.setAttribute("src", "../images/" + get_color(new_color) + ".png");
	delete_list = [];
	clear_styles("all");
	//global_list.splice(0, global_list.length - 1);
}

function chessboard_projection(name) {
	return String.fromCharCode(65 + name.y, 49 + name.x);
}