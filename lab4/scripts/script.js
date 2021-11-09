var is_active = 0;
var checker_name;
var checkers;
var marked = [];
var red_flag = false;

function start() {
	clear();
	checkers = [[0,2,0,2,0,2,0,2],
				[2,0,2,0,2,0,2,0],
				[0,2,0,2,0,2,0,2],
				[0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0],
				[1,0,1,0,1,0,1,0],
				[0,1,0,1,0,1,0,1],
				[1,0,1,0,1,0,1,0]];
	fill();
}

function example_first() {
	clear();
	checkers = [[0,2,0,0,0,0,0,0],
				[0,0,2,0,2,0,0,0],
				[0,0,0,0,0,0,0,2],
				[0,0,2,0,0,0,0,0],
				[0,0,0,0,0,1,0,1],
				[0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0],
				[0,0,4,0,0,0,0,0]];
	fill();
}

function clear() {
	is_prompt = 0;
	var imgs = document.getElementsByClassName("field")[0].getElementsByTagName("img");
	for (var i = imgs.length - 1; i > -1 ; i--) {
		imgs[i].remove();
	}
	for (var i = 0; i < 8; i++) {
		for(var j = 0; j < 8; j++) {
			document.getElementsByClassName("field")[0].getElementsByTagName("table")[0].rows[i + 1].getElementsByTagName("td")[j].style.cssText = ``;
		}
	}
}

function fill() {
	for(var i = 0; i < 8; i++) {
		for(var j = 0; j < 8; j++) {
			if(checkers[i][j] != 0) {
				var checker = document.createElement("IMG");
				if(checkers[i][j] == 2) {
			    	checker.setAttribute("src", "../images/check_black.png");
				} else if(checkers[i][j] == 1) {
					checker.setAttribute("src", "../images/check_white.png");
				} else if(checkers[i][j] == 4) {
					checker.setAttribute("src", "../images/king_black.png");
				} else if(checkers[i][j] == 3) {
					checker.setAttribute("src", "../images/king_white.png");
				}
				const name = {x : 7-i, y : j};
				const color = checkers[i][j];
				checker.addEventListener("click", function(e){
					choose(name, this, color);
				});
				document.getElementsByClassName("field")[0].getElementsByTagName("table")[0].rows[i + 1].getElementsByTagName("td")[j].appendChild(checker);
			}
		}
	}
}

function choose(name, checker, color) {
	if(is_active == 0) {
		is_active = 1;
		checker_name = name.x + "," + name.y;
		checker.style.cssText = `padding: 0;`;
		recalculation(name, color);
	} else if(is_active == 1 && checker_name == name.x + "," + name.y) {
		is_active = 0;
		checker.style.cssText = "";
		clear_styles("all");
	}
}

function recalculation(name, color) {
	x = name.x + 8;
	y = name.y + 8;
	for(var k = 0; k <= 8; k += 2) {
		if(k == 4) {
			continue;
		}
		var vec = {x : k % 3 - 1, y : Math.floor(k / 3) - 1};
		var i = x;
		var j = y;
		var block = 0;
		for(;i >= 8 && j >= 8 && i <= 15 && j <= 15;) {
			i += vec.x;
			j += vec.y;
			if(i >= 8 && j >= 8 && i <= 15 && j <= 15) {
				var dir = (color % 2) * 2 - 1;
				if(checkers[7-(i % 8)][j % 8] == 0 && block == 0) {
					if(i == x + dir || color > 2) {
						document.getElementsByClassName("field")[0].getElementsByTagName("table")[0].rows[7-(i % 8) + 1].getElementsByTagName("td")[j % 8].style.cssText = `background-color: #02f732;`;
						marked.push({i : 7-(i % 8), j : j % 8, color : 0});
					}
				} else if(checkers[7-(i % 8)][j % 8] % 2 != checkers[7-(x % 8)][y % 8] % 2 && block == 0) {
					if(i == x + dir || i == x - dir || color > 2) {
						block = 1;
						console.log(checkers[7-(i % 8)][j % 8] + "  " + checkers[7-(x % 8)][y % 8]);
						console.log(i + "  " + j);
					}
				} else if(checkers[7-(i % 8)][j % 8] == 0 && block == 1) {
					if(i == x + 1 + dir || i == x - 1 - dir || color > 2) {
						red_flag = true;
						document.getElementsByClassName("field")[0].getElementsByTagName("table")[0].rows[7-(i % 8) + 1].getElementsByTagName("td")[j % 8].style.cssText = `background-color: #f50202;`;
						marked.push({i : 7-(i % 8), j : j % 8, color : 1});
					}
				} else if(checkers[7-(i % 8)][j % 8] != 0 && block == 1) {
					break;
				}
			}
		}
	}
	if(red_flag) { clear_styles("without_red"); }
	red_flag = false;
}

function clear_styles(priority) {
	var i = 0;
	while(i < marked.length) {
		if(priority == "without_red" && marked[i].color == 1) {
			i++;
			continue;
		}
		document.getElementsByClassName("field")[0].getElementsByTagName("table")[0].rows[marked[i].i + 1].getElementsByTagName("td")[marked[i].j].style.cssText = ``;
        marked.splice(i, 1);
	}
}