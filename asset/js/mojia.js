layui.config({
	version: magic.ver,
	base: magic.cdn + 'asset/js/',
}).extend({
	common: '{/}' + (magic.comm == 1 ? magic.tpl : magic.cdn) + '/asset/js/common'
}).use(['jquery', 'common'], function() {
	var common = layui.common,
		$ = layui.jquery;
	var mojia = {
		'global': {
			'sorted': function() {
				mojia.navbar.init();
				common.picing.init('.mo-situ-lazy');
				mojia.global.player('.mo-play-load');
				common.global.init();
				if (!common.global.trident()) {
					console.log('%c%c主题名称%c魔加v1.1(苹果CMSv10版)', 'line-height:28px', 'padding:4px;background:#222;color:#fff;font-size:16px;margin-right:15px', 'color:#3fa9f5;font-size:16px;line-height:28px');
					console.log('%c%c主题官网%chttp://mojia.amujie.com', 'line-height:28px', 'padding:4px;background:#222;color:#fff;font-size:16px;margin-right:15px', 'color:#ff9900;font-size:16px;line-height:28px');
				}
			},
			'change': 'e8848833321b347f2c0be332bc9d79fa',
			'player': function(str) {
				if (!$('.mo-java-play').length) return false;
				var iframe = document.getElementById('mo-play-iframe');
				if ($(str).attr('data-copy') == 1) {
					$('.mo-play-copyer').show().css('z-index', '99');
				} else if ($(str).attr('data-group') == 1) {
					var advert = document.getElementById('mo-play-iframe');
					advert.src = $(str).attr('data-link');
					advert.onload = function() {
						$('.mo-play-advert').show();
						$('.mo-play-iframe').show().css('z-index', '99');
						common.player.time(str, advert, $(str).attr('data-time'));
					}
				} else if ($('.mo-chat-info').attr('data-chat') == 1) {
					$('.mo-play-wechat').show().css('z-index', '99');
					if (common.cookie.get('mo_wechat')) {
						$('.mo-play-wechat').hide();
						common.player.judge(str);
					}
				} else common.player.judge(str);
			}
		},
		'moload': {},
		'navbar': {
			'init': function() {
				this.search('.mo-navs-submit', '.mo-navs-input');
				if ($('.mo-java-hunt').text()) this.record(7, 'mo_record', $('.mo-java-hunt').text(), '', '', '');
				if ($('.mo-java-data').attr('data-aid') == 15) this.record(7, 'mo_history', $('.mo-java-play').attr('data-name'), $('.mo-java-play').attr('data-show'), '', $('.mo-java-play').attr('data-nums'));
			},
			'search': function(btn, str) {
				$(document).on('click', btn, function(event) {
					if ($(this).prev().val()) location.href = mojia.navbar.jumper($(this).prev().val().replace(/</g, '').replace(/>/g, '').trim());
				});
				$(document).on('focus', str, function(event) {
					common.global.edge();
					common.global.submit(btn, str);
					common.navbar.adding('.mo-part-mask');
					common.navbar.baidu();
					$('.mo-java-ceal').hide();
					$('.mo-pops-search').show();
					$(str).val($(str).val());
					mojia.navbar.keyup(str);
				});
			},
			'keyup': function(str) {
				if ($('.mo-navs-search').attr('data-auto') == 1) {
					$(document).on('keyup', str, function(event) {
						var keycode = window.event ? event.keyCode : event.which;
						var keyname = $(this).val().trim();
						if (keyname) {
							mojia.navbar.lister(str, keyname, keyname, keycode, 0);
						} else {
							$('.mo-pops-keys').hide().find('.mo-pops-list').addClass('mo-pbxs-10px mo-pbmd-5px').parent().next().show().children(':first').addClass('mo-ptmd-5px');
						}
					});
				}
			},
			'jumper': function(keyword) {
				return $('.mo-navs-name').attr('data-href') + '?wd=' + encodeURIComponent(common.global.filter(keyword));
			},
			'lister': function(input, keyname, nowname, keycode, count) {
				var type = $('.mo-navs-name').attr('data-type');
				$.post(magic.path + 'index.php/ajax/suggest.html?limit=10&mid=' + type + '&wd=' + encodeURIComponent(keyname), function(data) {
					if (data.code != 1) return false;
					var topic = JSON.stringify(data).replace('"list":{', '"list":[').replace('},"url"', '],"url"').replace(/"[0-9]":{/g, '{').replace(/topic_/g, '');
					data = type == 3 ? JSON.parse(topic) : data;
					if (data.list.length > 0) {
						var output = '';
						for (var i = 0; i < data.list.length; i++) output += '<li class="mo-pops-item mo-pops-sort mo-cols-rows"><a class="mo-pnxs-15px mo-lhxs-40px mo-wrap-arow" href="' + $('.mo-navs-name').attr('data-href') + '?wd=' + data.list[i].name + '"><span class="mo-pops-text mo-wrap-arow">' + data.list[i].name.replace(keyname, '<span class="mo-text-mojia">' + keyname + '</span>') + '</span></a></li>';
						mojia.navbar.keying(input, '.mo-pops-sort', 'mo-back-fixed', '.mo-pops-text', keycode, output);
					} else {
						if (count == 1) {
							var output = '<li class="mo-pops-item mo-cols-rows"><a class="mo-pnxs-15px mo-lhxs-40px mo-wrap-arow" href="' + mojia.navbar.jumper(nowname) + '"><span class="mo-pops-text mo-wrap-arow mo-cols-info mo-cols-xs9">' + nowname + '</span><span class="mo-wrap-arow mo-coxs-right mo-cols-info mo-cols-xs3">查看更多</span></a></li>';
							$('.mo-pops-keys').show().find('.mo-pops-list').html(output).removeClass('mo-pbxs-10px mo-pbmd-5px').parent().next().show().children(':first').removeClass('mo-ptmd-5px');
							return false;
						}
						layui.use('pinyin', function() {
							mojia.navbar.lister(input, layui.pinyin.init(keyname), keyname, keycode, count + 1);
						});
					}
				}, 'json');
			},
			'keying': function(input, sort, back, name, keycode, output) {
				var index = $('.' + back).prevAll().length;
				if (keycode == 40) {
					if ($(sort).hasClass(back)) {
						if (index == $(sort).length - 1) {
							$(input).val($(sort).eq(0).find(name).text());
							$(sort).removeClass(back).eq(0).addClass(back);
						} else {
							$(input).val($(sort).eq(index + 1).find(name).text());
							$(sort).removeClass(back).eq(index + 1).addClass(back);
						}
					} else {
						$(input).val($(sort).eq(0).find(name).text());
						$(sort).removeClass(back).eq(0).addClass(back);
					}
				} else if (keycode == 38) {
					if (index == 0) {
						$(input).val($(sort).eq($(sort).length - 1).find(name).text());
						$(sort).removeClass(back).eq($(sort).length - 1).addClass(back);
					} else {
						$(input).val($(sort).eq(index - 1).find(name).text());
						$(sort).removeClass(back).eq(index - 1).addClass(back);
					}
				} else {
					$('.mo-pops-keys').show().find('.mo-pops-list').html(output).addClass('mo-pbxs-10px mo-pbmd-5px').parent().next().hide();
				}
			},
			'record': function(count, type, name, show, link, num) {
				if (name == undefined) return false;
				var link = location.href;
				var jsondata = common.cookie.get(type);
				if (jsondata != undefined) {
					var jsoninfo = eval(jsondata);
					var jsonstr = '[{"name":"' + common.global.filter(name) + '","show":"' + show + '","link":"' + link + '","num":"' + num + '"},';
					for (var i = 0; i < jsoninfo.length; i++) {
						if (jsoninfo[i].name != name) {
							jsonstr += '{"name":"' + jsoninfo[i].name + '","show":"' + jsoninfo[i].show + '","link":"' + jsoninfo[i].link + '","num":"' + jsoninfo[i].num + '"},';
						} else count = count + 1;
						if (i > count) break;
					}
					var jsonstr = jsonstr.substring(0, jsonstr.lastIndexOf(','));
					jsonstr += ']';
				} else var jsonstr = '[{"name":"' + common.global.filter(name) + '","show":"' + show + '","link":"' + link + '","num":"' + num + '"}]';
				common.cookie.set(type, jsonstr, 7);
			}
		}
	};
	mojia.global.sorted();
});
