var mysql = require('mysql');
var nodejieba = require("nodejieba");
const fs = require('fs');

// var HOST = '127.0.0.1';
var HOST = '210.28.188.103';
var DATABASE = 'pinyuan';
//
var user = 'root';
var password = '123456';

var client;
var reg1 = /[“”"]/g;
var reg2 = /[‘’']/g;
// var connect = function () {
// 	client = mysql.createConnection({
// 		host:HOST,
// 		user:user,
// 		password:password,
// 		database:DATABASE
// 	});
// 	client.connect();
// }
// var end = function(){
// 	client.end();
// }

/*
*refactor
*/

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : HOST,
    user     : user,
    password : password,
    database : DATABASE,
    debug    :  false
});
var connection;


//政策项目
var selectAsPagination = function(tag,callback) {
	var range = 4;
	var sql = "";
	if(tag == 0) {
		sql = "(select id, title, image, uploadtime, case content when '' then 2 else 1 end as type  from policy where ismain = 1 and image <> '' order by uploadtime desc limit "+range/2+  
			  ")  union all "+
			  "(select id, title, image, uploadtime, case content when '' then 1 else 2 end as type  from project where ismain = 1 and image <> '' order by uploadtime desc limit "+range/2+
			  ")";
	}
	if(tag == 1) {
		sql = "select id, title, image, uploadtime, case content when '' then 2 else 1 end as type  from policy where ismain = 1 and image <> '' order by uploadtime desc limit "+range;
	}
	if(tag == 2) {
		sql = "select id, title, image, uploadtime, case content when '' then 1 else 2 end as type  from Project where ismain = 1 and image <> '' order by uploadtime desc limit "+range;
	}
	// console.log("hh:"+sql)
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }      

	    connection.query(sql,function(err,resluts){
			callback(err,resluts);
			connection.release();
		});  
	});
	// client.query(sql,function(err,resluts){
	// 	callback(err,resluts);
	// });
}

var selectAsList = function(tag,lastupload,sinceupload,callback) {
	var range = 6;
	var sql = "";

	if(tag == 0){
		if(lastupload == 0 && sinceupload == 0) {
			sql = " (select id, title, image, content, uploadtime, case content when '' then 2 else 1 end as type from policy order by uploadtime desc limit "+range/2+
			      " ) union all "+
			      " (select id, title, image, content, uploadtime, case content when '' then 1 else 2 end as type from project order by uploadtime desc limit "+range/2+
			      " ) order by uploadtime desc ";
		}
		if(lastupload != 0 && sinceupload == 0) {
			sql = " (select id, title, image, content, uploadtime, case content when '' then 2 else 1 end as type from policy where uploadtime > "+lastupload+" order by uploadtime desc limit "+range/2+
				  " ) union all "+
				  " (select id, title, image, content, uploadtime, case content when '' then 1 else 2 end as type from project where uploadtime > "+lastupload+" order by uploadtime desc limit "+range/2+
				  " ) order by uploadtime desc ";
		}
		if(lastupload == 0 && sinceupload != 0) {
			sql = " (select id, title, image, content, uploadtime, case content when '' then 2 else 1 end as type from policy where uploadtime < "+sinceupload+" order by uploadtime desc limit "+range/2+
				  " ) union all "+
				  " (select id, title, image, content, uploadtime, case content when '' then 1 else 2 end as type from project where uploadtime < "+sinceupload+" order by uploadtime desc limit "+range/2+
				  " ) order by uploadtime desc ";
		}
	}

	if(tag == 1){
		if(lastupload == 0 && sinceupload == 0) {
			sql = "select id, title, image, content, uploadtime, case content when '' then 2 else 1 end as type from policy order by uploadtime desc limit "+range;
		}
		if(lastupload != 0 && sinceupload == 0) {
			sql = "select id, title, image, content, uploadtime, case content when '' then 2 else 1 end as type from policy where uploadtime > "+lastupload+" order by uploadtime desc limit "+range;
		}
		if(lastupload == 0 && sinceupload != 0) {
			sql = "select id, title, image, content, uploadtime, case content when '' then 2 else 1 end as type from policy where uploadtime < "+sinceupload+" order by uploadtime desc limit "+range;
		}
	}

	if(tag == 2){
		if(lastupload == 0 && sinceupload == 0) {
			sql = "select id, title, image, content, uploadtime, case content when '' then 1 else 2 end as type from project order by uploadtime desc limit "+range;
		}
		if(lastupload != 0 && sinceupload == 0) {
			sql = "select id, title, image, content, uploadtime, case content when '' then 1 else 2 end as type from project where uploadtime > "+lastupload+" order by uploadtime desc limit "+range;
		}
		if(lastupload == 0 && sinceupload != 0) {
			sql = "select id, title, image, content, uploadtime, case content when '' then 1 else 2 end as type from project where uploadtime < "+sinceupload+" order by uploadtime desc limit "+range;
		}
	}
	// console.log("sql-----"+sql);
	// client.query(sql,function(err,resluts){
	// 	callback(err,resluts);
	// });
// console.log(sql);
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});

}

var selectAsDetail = function(type,id,callback) {
	var sql = "";
	if (type == 1) {
		sql = "select title, content, image, uploadtime from policy where id = "+id;
	} else {
		sql = "select title, content, image, uploadtime from project where id = "+id;
	}
	// client.query(sql,function(err,resluts){
	// 	callback(err,resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}

//村务

var selectFromEventByType = function(tag,regionid, lastupload,sinceupload,callback) {
	var sql = "";
	var range = 6;
	if(lastupload == 0 && sinceupload == 0) {
		sql = "select id, title, image, content, uploadtime from event "+
			  " order by uploadtime desc "+
			  " where categoryid = "+tag+
			  " and regionid = "+regionid+
			  " limit "+range;
	}
	if(lastupload != 0 && sinceupload == 0) {
		sql = "select id, title, image, content, uploadtime from event "+
			  " order by uploadtime desc "+
			  " where categoryid = "+tag+
			  " and regionid = "+regionid+
			  " uploadtime > "+lastupload+
			  " limit "+range;
	}
	if(lastupload == 0 && sinceupload == 0) {
		sql = "select id, title, image, content, uploadtime from event "+
			  " order by uploadtime desc "+
			  " where categoryid = "+tag+
			  " and regionid = "+regionid+
			  " uploadtime < "+sinceupload+
			  " limit "+range;
	}
	// client.query(sql,function(err,resluts){
	// 	callback(err,resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}

var selectAsDetailFromEvent = function(id,callback) {
	var sql = "select * from event where id = "+id;
	// console.log(sql);
	// client.query(sql,function(err,resluts){
	// 	callback(err,resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });    
	});

}



//全局搜索


var globalSearch = function(tag,key,callback) {
	var sql = "";
	var conditon = "";
	var colomn = "";
	key = key.trim();
	var words = nodejieba.cut(key);
	// console.log(words);
	if(words.length==0){
		sql = "select * from event where id = 0";
	}else{
		if (tag == 0) {
			colomn = "title";
		} else {
			colomn = "content";
		}
		for (var i = words.length - 1; i >= 0; i--) {
			if(conditon == "") {
				conditon = colomn + " like '%"+words[i]+"%' ";
			} 
			conditon = conditon + " or " + colomn + " like '%"+words[i]+"%' ";
		}
		sql = " (select id, title, image, uploadtime, content, case content when '' then 2 else 1 end as type from policy where "+conditon+" )"+
			  " union all "+
			  " (select id, title, image, uploadtime, content, case content when '' then 1 else 2 end as type from project where "+conditon+" )"+
			  " union all "+
			  " (select id, title, image, uploadtime, content, case content when '' then 4 else 3 end as type from event where "+conditon+" )";
	}

	

	// console.log(sql);
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      return;
	    } 
		if(key.length!=0){
			var dup = "select content from history where content = '"+key+"'";
			connection.query(dup,function(err,results){
				if(err){
					console.log(err.message);
					connection.release();
					return;
				}

				if(results.length==0){
					var History = "insert into history (content,uploadtime) values ('"+key+"',"+Date.parse(new Date())+")";
						// console.log(History);
					connection.query(History,function(error,results){
						if(error){
							connection.release();
							console.log("history---"+error.message);
						}
						connection.release();
							
					});	
				}
			})

		}
	});	
	
	
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, results){
	    	var ret = new Array();
	    	var flag = 0;
	    	for (var i = results.length - 1; i >= 0; i--) {
	    		var content = results[i].content;
	    		results[i].content = content.replace(/<[^>]*>/g,"").replace(/&quot/g,"").replace(/&apos/g,"");
	    		
	    		for (var j = words.length - 1; j >= 0; j--) {
	    			if(results[i].content.indexOf(words[j])!=-1){
	    				flag++;
	    			}
	    		}

	    		if(flag>=words.length){
	    			ret.push(results[i]);
	    		}
	    		flag = 0;
	    	}
	        callback(err,ret);
	        // callback(err, resluts);
	        connection.release();
	    });

	    
	});

}

/** admin */

//用户名密码验证 
var adminLoginUPValidate = function(username, password, callback){

	var sql = "SELECT * FROM maintainer WHERE name='" + username + "' and passwd='" + password + "';";
	pool.getConnection(function(err,connection){
        if (err) {

          console.log(err.message);
          connection.release();
          return;
        }   

        connection.query(sql, function(err, resluts){
        	
			callback(err, resluts);
			connection.release();
		});

        
	});

	// client.query(sql, function(err, resluts){
	// 	callback(err, resluts);
	// });
	// connection.query(sql, function(err, resluts){
	// 	callback(err, resluts);
	// });
}

//
var selectFromMaintainerByName = function(userInfo,callback){
	var sql = "SELECT * FROM maintainer WHERE name='" + userInfo["user"] + "'";
	pool.getConnection(function(err,connection){
        if (err) {

          console.log(err.message);
          connection.release();
          return;
        }   

        connection.query(sql, function(err, resluts){
        	
			callback(err, resluts);
			connection.release();
		});
	});

}

//获取所有管理员
var adminDatamanSelectAll = function(callback){
	var sql = "select * from maintainer where typeid=1 order by id desc;"
	// client.query(sql, function(err, resluts){
	// 	callback(err, resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}

var selectFromRegionByName = function(info,callback){
	var sql = "select * from region where name = '"+info['name']+"'";
	// client.query(sql, function(err, resluts){
	// 	callback(err, resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}

//注册
var adminDatamanInserOne = function(userInfo ,callback){
	var sql = "insert into maintainer (name, passwd, regionid, typeid, lastlogintime) values('"+userInfo['user']+"', '"+userInfo['passwd']+"', '"+userInfo["regionid"]+"', "+userInfo["typeid"]+", '"+userInfo["lastlogintime"]+"');";
	// client.query(sql, function(err){
	// 	callback(err);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}

//删除
var adminDatamanDeleteOne = function(uid, callback){
	var sql = "delete from maintainer where id=" + uid + ";";
	// console.log(sql);
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}

//搜索
var adminDatamanSearchKeyword = function(key, callback){
	var sql = "select * from manitainer where user like " + key + ";";
	// client.query(sql, function(err, resluts){
	// 	callback(err, resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}


//获取所有乡镇及村庄
var adminRegionSelectAllList = function(callback){
	var sql = "select * from region;";
	// client.query(sql, function(err, resluts){
	// 	callback(err, resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}

//添加乡镇
var adminRegionAddBig = function(name, callback){
	var sql = "insert into region (name, super) values('"+name+"', 0);";
	// client.query(sql, function(err){
	// 	callback(err);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}

//添加村庄
var adminRegionAddSmall = function(name, superID, callback){
	var sql = "insert into region (name, super) values('"+name+"', "+superID+")";
	// client.query(sql, function(err){
	// 	callback(err);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}



//分页条惠农政策
var adminPolicySelectNumber = function(count, callback){
	var start = count.start ? count.start : 0;
	var num = count.num ? count.num : 0;
	var sql = "select * from policy ORDER BY uploadtime desc limit "+start+","+num+";";
    
  //   client.query(sql, function(err, resluts){
		// callback(err, resluts);
  //   });
  	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}
/*----------*/
//惠农政策数量
var adminPolicyCount = function(callback){
	var sql = "select count(*) from policy;"

	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, results){
			if(!results || results.length == 0){
				callback(0);
				return;
			}
			callback(results[0]["count(*)"]);
			connection.release();
		})

	    
	});



}

//分页条项目政策
var adminProjectSelectNumber = function(count, callback){
	var start = count.start ? count.start : 0;
	var num = count.num ? count.num : 0;
	var sql = "select * from project ORDER BY uploadtime desc limit "+start+","+num+";";
    
  //   client.query(sql, function(err, resluts){
		// callback(err, resluts);
  //   });
  	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}

//项目数量
var adminProjectCount = function(callback){
	var sql = "select count(*) from project;"
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, results){
			if(results.length == 0){
				callback(0);
				connection.release();
				return;
			}
			callback(results[0]["count(*)"]);
			connection.release();
		})

	    
	});


}

//乡镇&&用户
var adminRegionSelectRegionIDandUserName = function(callback){
	var sql = 'select id, name from region where super = 0;';
	// client.query(sql, function(err, resluts){
	// 	callback(err, resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}

//获取惠农政策详情
var adminPolicySelectOne = function(id, callback){
	var sql = "select * from policy where id =" + id;
	// client.query(sql, function(err, resluts){
	// 	callback(err, resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}

//删除项目
var adminPolicyDeleteOne = function(id, callback){
	var sql = "delete from policy where id =" + id;
	// client.query(sql, function(err, resluts){
	// 	callback(err);
	// });	
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    connection.query("select image from policy where id="+id,function(err,results){
	    	if(results.length!=0){
	    		file = "./public"+results[0]['image'];
	    		fs.exists(file, function(exists) {
					  if (exists) {
					  	try{
					  		fs.unlinkSync(file);
					  	}catch(e){
					  		console.log("can't remove");
					  	}
					    
					  } 
				});
	    	}
	    	connection.query(sql, function(err, resluts){
		        
		        callback(err, resluts);
		        connection.release();
		    });

	    });
	    

	    
	});
}

//删除项目
var adminProjectDeleteOne = function(id, callback){
	var sql = "delete from project where id =" + id;
	// client.query(sql, function(err, resluts){
	// 	callback(err);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    connection.query("select image from project where id="+id,function(err,results){
	    	
	    	if(results.length!=0){
	    		file = "./public"+results[0]['image'];
	    		fs.exists(file, function(exists) {
					  if (exists) {
					    try{
					  		fs.unlinkSync(file);
					  	}catch(e){
					  		console.log("can't remove");
					  	}
					  } 
				});
	    	}
	    	connection.query(sql, function(err, resluts){
		        
		        callback(err, resluts);
		        connection.release();
		    });

	    })
	    

	    
	});	
}

//获取惠农项目详情
var adminProjectSelectOne = function(id, callback){
	var sql = "select * from project where id =" + id;
	// client.query(sql, function(err, resluts){
	// 	callback(err, resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}

//登录时间更新
var adminLoginupdateLoginTime = function(id, time){
	var sql = "update maintainer set lastlogintime = '"+time+"' where id = "+ id;
		pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        connection.release();
	    });

	    
	});
}

//修改一篇惠农政策
var adminPolicyModifyOne = function(info, callback){
	var sql = "";
	if(info["image"]==""){
		sql = "update policy set title='"+info["title"]+"',content='"+info["content"].replace(reg1,"&quot;").replace(reg2,"&apos;")+"',uploadtime='"+info['uploadtime']+"' where id="+info['id']+";";
	}else{
		sql = "update policy set title='"+info["title"]+"',content='"+info["content"].replace(reg1,"&quot;").replace(reg2,"&apos;")+"',uploadtime='"+info['uploadtime']+"',image='"+info["image"]+"' where id="+info['id']+";";
	}
	
	// client.query(sql, function(err, resluts){
	// 	callback(err, resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    connection.query("select image from policy where id="+info['id'],function(err,results){
	    	if(results.length!=0){
	    		if(info["image"]!=""){
	    			file = "./public"+results[0]['image'];
		    		fs.exists(file, function(exists) {
						  if (exists) {
						    try{
						  		fs.unlinkSync(file);
						  	}catch(e){
						  		console.log("can't remove");
						  	}
						  } 
					});

	    		}
	    		
	    	}
	    	connection.query(sql, function(err, resluts){
		        
		        callback(err, resluts);
		        connection.release();
		    });
	    })
	    

	    
	});
}

//修改一篇惠农项目
var adminProjectModifyOne = function(info, callback){
	var sql = "";
	if(info["image"]==""){
		sql = "update project set title='"+info["title"]+"',content='"+info["content"].replace(reg1,"&quot;").replace(reg2,"&apos;")+"',uploadtime='"+info['uploadtime']+"' where id="+info['id']+";";
	}else{
		sql = "update project set title='"+info["title"]+"',content='"+info["content"].replace(reg1,"&quot;").replace(reg2,"&apos;")+"',uploadtime='"+info['uploadtime']+"',image='"+info["image"]+"' where id="+info['id']+";";
	}
	
	// client.query(sql, function(err, resluts){
	// 	callback(err, resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    connection.query("select image from project where id="+info["id"],function(err,results){
	    	if(results.length!=0){
	    		if(info["image"]!=""){
	    			file = "./public"+results[0]['image'];
		    		fs.exists(file, function(exists) {
						  if (exists) {
						    try{
						  		fs.unlinkSync(file);
						  	}catch(e){
						  		console.log("can't remove");
						  	}
						  } 
					});

	    		}
	    		
	    	}
	    	connection.query(sql, function(err, resluts){
		        
		        callback(err, resluts);
		        connection.release();
		    });

	    });
	    

	    
	});
}


//写一篇惠农政策
var adminPolicyInsertOne = function(info , callback){
	var sql = "insert into policy (title, content, image, ismain, uploadtime) values('"+info["title"]+"', '"+info["content"].replace(reg1,"&quot;").replace(reg2,"&apos;")+"', '"+info["image"]+"', 1, '"+info["uploadtime"]+"');";
	// client.query(sql, function(err, resluts){
	// 	callback(err, resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}

//写一篇惠农项目
var adminProjectInsertOne = function(info , callback){
	var sql = "insert into project (title, content, image, ismain, uploadtime) values('"+info["title"]+"', '"+info["content"].replace(reg1,"&quot;").replace(reg2,"&apos;")+"', '"+info["image"]+"', 1, '"+info["uploadtime"]+"');";
	// client.query(sql, function(err, resluts){
	// 	callback(err, resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}

//政策搜索
var adminPolicySearch = function(key, callback){
	var sql;
	var conditon = "";
	var colomn = "content";
	var words = nodejieba.cut(key);
	
	for (var i = words.length - 1; i >= 0; i--) {
		if(conditon == "") {
			conditon = colomn + " like '%"+words[i]+"%' ";
		} 
		conditon = conditon + " or " + colomn + " like '%"+words[i]+"%' ";
	}

	colomn = "title";
	for (var i = words.length - 1; i >= 0; i--) {	
		conditon = conditon + " or " + colomn + " like '%"+words[i]+"%' ";
	}


	sql = "select * from policy where "+conditon;
	// console.log(sql);

  //   client.query(sql, function(err, resluts){
		// callback(err, resluts);
  //   });
  	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, results){
	        var ret = new Array();
	    	var flag = 0;
	    	for (var i = results.length - 1; i >= 0; i--) {
	    		var content = results[i].content;
	    		results[i].content = content.replace(/<[^>]*>/g,"").replace(/&quot/g,"").replace(/&apos/g,"");
	    		
	    		for (var j = words.length - 1; j >= 0; j--) {
	    			if(results[i].content.indexOf(words[j])!=-1){
	    				flag++;
	    			}
	    		}

	    		if(flag>=words.length){
	    			ret.push(results[i]);
	    		}
	    		flag = 0;
	    	}
	        callback(err,ret);
	        connection.release();
	    });

	    
	});
}

//项目搜索
var adminProjectSearch = function(key, callback){
	var sql;
	var conditon = "";
	var colomn = "content" ;
	var words = nodejieba.cut(key);
	

	for (var i = words.length - 1; i >= 0; i--) {
		if(conditon == "") {
			conditon = colomn + " like '%"+words[i]+"%' ";
		} 
		conditon = conditon + " or " + colomn + " like '%"+words[i]+"%' ";
	}

	colomn = "title";
	for (var i = words.length - 1; i >= 0; i--) {

		conditon = conditon + " or " + colomn + " like '%"+words[i]+"%' ";
	}


	sql = "select * from project where "+conditon;

  //   client.query(sql, function(err, resluts){
		// callback(err, resluts);
  //   });
  	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, results){
	        var ret = new Array();
	    	var flag = 0;
	    	for (var i = results.length - 1; i >= 0; i--) {
	    		var content = results[i].content;
	    		results[i].content = content.replace(/<[^>]*>/g,"").replace(/&quot/g,"").replace(/&apos/g,"");
	    		
	    		for (var j = words.length - 1; j >= 0; j--) {
	    			if(results[i].content.indexOf(words[j])!=-1){
	    				flag++;
	    			}
	    		}

	    		if(flag>=words.length){
	    			ret.push(results[i]);
	    		}
	    		flag = 0;
	    	}
	        callback(err,ret);
	        connection.release();
	    });

	    
	});
}

//删除一个村庄/乡镇
var adminRegionDeleteOne = function(id, callback){
	var firstSql = "delete from region where super ="+id;
    var sql = "delete from region where id = "+ id;
    pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    } 
	    connection.query(firstSql, function(err, results){
	    	adminEventDeleteByRegionid(id);
    		connection.query(sql, function(err, results){
				adminEventDeleteBySuperid(id);
				callback(err, results);
				connection.release();
    			
				
			});
	    	
			
			
	    });
	});    
    

}



//获取乡镇下所有村庄
var adminRegionSelectVillages = function(id, callback){
	var sql = "select * from region where super = "+id;
  //   client.query(sql, function(err, resluts){
		// callback(err, resluts);
  //   });
  	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});

}
//获取所有村庄
var adminRegionSelectAllVillages = function(callback){
	var sql = "select * from region where super <> 0";
  //   client.query(sql, function(err, resluts){
		// callback(err, resluts);
  //   });
  	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});	
}

//显示相应四大类村务
var adminEventSelectAll = function(id, callback){
	var sql = "select id, title, regionid, categoryid, uploadtime from event where regionid =" + id;
	// client.query(sql, function(err, resluts){
	// 	callback(err, resluts);
 //    });
 	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}

//显示四大类
var adminEventCategorys = function(callback){
	var sql = "select * from category;";
	// client.query(sql, function(err, resluts){
	// 	callback(err, resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}

//删除村务公开
var adminEventDelete = function(id, callback){
	var sql = "delete from event where id =" + id;
	// client.query(sql, function(err, resluts){
	// 	callback(err);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   

	    connection.query("select * from event where id = "+id,function(err,results){
	    	console.log("====="+__dirname);
	    	if(results.length!=0){
	    		file = "./public"+results[0]['image'];
	    		fs.exists(file, function(exists) {
					  if (exists) {
					    try{
					  		fs.unlinkSync(file);
					  	}catch(e){
					  		console.log("can't remove");
					  	}
					  } 
				});
	    		

	    	}
	    	connection.query(sql, function(err, results){
		        
		        callback(err, results);
		        connection.release();
		    });
	    });
	    
	    

	    
	});
}

var adminEventDeleteByRegionid = function(id){
	var sql = "delete  from event where regionid =" + id;
	// client.query(sql, function(err, resluts){
	// 	callback(err);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    connection.query("select * from event where regionid = "+id,function(err,results){
	    	if(results.length!=0){
	    		for (var i = results.length - 1; i >= 0; i--) {
	    			file = "./public"+results[0]['image'];
	    			fs.exists(file, function(exists) {
						  if (exists) {
						    try{
						  		fs.unlinkSync(file);
						  	}catch(e){
						  		console.log("can't remove");
						  	}
						  } 
					});
	    			
	    		}

	    	}
	    	connection.query(sql, function(err, results){

		        connection.release();
		    });
	    });
	    

	    
	});
}
var adminEventDeleteBySuperid = function(id){
	var sql = "delete from event where superid =" + id;
	// client.query(sql, function(err, resluts){
	// 	callback(err);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    connection.query("select * from event where superid ="+id,function(err,results){
	    	if(results.length!=0){
	    		for (var i = results.length - 1; i >= 0; i--) {
	    			file = "./public"+results[0]['image'];
	    			fs.exists(file, function(exists) {
						  if (exists) {
						    try{
						  		fs.unlinkSync(file);
						  	}catch(e){
						  		console.log("can't remove");
						  	}
						  } 
					});
	    			
	    		}
	    	}
	    	connection.query(sql, function(err, results){ 
		        connection.release();
		    });
	    });
	    

	    
	});
}

// var deleteEventImg = function(path){

// }

//获取一条村务公开
var adminEventSelectOne = function(id, callback){
	var sql = "select * from event where id ="+id;
	// client.query(sql, function(err, resluts){
	// 	callback(err, resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}

//上传一条村务公开
var adminEventModifyOne = function(article, callback){
	
	var sql = "";
	if(article["image"]==""){
		sql = "update event set title='"+article["title"]+"',content='"+article["content"].replace(reg1,"&quot;").replace(reg2,"&apos;")+"',regionid='"+article["regionid"]+"',categoryid='"+article["categoryid"]+"',uploadtime='"+article["uploadtime"]+"' where id="+article['id'];
	}else{
		sql = "update event set title='"+article["title"]+"',content='"+article["content"].replace(reg1,"&quot;").replace(reg2,"&apos;")+"',image='"+article["image"]+"',regionid='"+article["regionid"]+"',categoryid='"+article["categoryid"]+"',uploadtime='"+article["uploadtime"]+"' where id="+article['id'];
	}
	
	// console.log(sql);
	// client.query(sql, function(err, resluts){
	// 	callback(err, resluts);
	// })
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    connection.query("select image from event where id = "+article['id'],function(err,results){
	    	if(results.length!=0){
	    		if(article["image"]!=""){
	    			file = "./public"+results[0]['image'];
		    		fs.exists(file, function(exists) {
						  if (exists) {
						    try{
						  		fs.unlinkSync(file);
						  	}catch(e){
						  		console.log("can't remove");
						  	}
						  } 
					});

	    		}
	    		
	    	}
	    	connection.query(sql, function(err, resluts){
		        
		        callback(err, resluts);
		        connection.release();
		    });
	    });
	    

	    
	});
}

//写村务公开
var adminEventAddOne = function(article, callback){
	var town = "select super from region where id = "+article["regionid"];
	// console.log("town----"+town);

	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    } 
	    connection.query(town,function(err,ret){
		// console.log("----"+ret);
			var sql = "insert into event (title, content, image, regionid, categoryid, uploadtime, superid) values('"+article["title"]+"', '"+article["content"].replace(reg1,"&quot;").replace(reg2,"&apos;")+"', '"+article["image"]+"', '"+article["regionid"]+"', '"+article["categoryid"]+"', '"+article["uploadtime"]+"','"+ret[0].super+"');";
			// console.log("sql---"+sql);
			connection.query(sql, function(err, resluts){
				callback(err);
				connection.release();
			});
		});

	});    

	
}

var adminRegionSelectAllListWithTypeid = function(typeid, vid, callback){
	var sql = "";
	if(typeid == 0){
		sql = "select * from region where super <> 0";
	}else{
		sql = "select * from region where super ="+vid;
	}
	// client.query(sql, function(err, resluts){
	// 	callback(err, resluts);
	// })
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;

	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});

}

/** admin */




/** web*/
var selectFromPolicyByIsmain = function(callback){
	var sql = "select id, title, image from policy where ismain = 1 and image <> '' order by uploadtime desc limit 4";
	// client.query(sql,function(err,results){
	// 	callback(err,results);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}


var selectFromPolicyAsList = function(para,callback){
	var sql = "select * from policy order by uploadtime desc limit  6";
	// client.query(sql,function(err,resluts){
	// 	callback(err,resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
};



var selectFromProjectAsList = function(para,callback){
	var sql = "select * from project order by uploadtime desc limit  6";
	// client.query(sql,function(err,resluts){
	// 	callback(err,resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
};


var selectTownFromRegion = function(para,callback){
	var sql = "select * from region where super = 0";
	// client.query(sql,function(err,resluts){
	// 	callback(err,resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
};

var selectVillageFromRegion = function(towns,callback){
	var sql = "select * from region where super <> 0";
	// client.query(sql,function(err,results){
	// 	callback(err,results);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}



var selectFromEventBySuperid = function(para,superids,callback){
	var condition = "";
	var sql = "";
	if(superids.length==0){
		sql = "select * from event  where id = 0";
	}else{
		for (var i = superids.length - 1; i >= 0; i--) {
			if(condition == ""){
				condition = " superid = "+superids[i].id;
			}
			condition = condition + " or superid = "+ superids[i].id;
			
		}
		sql = "select * from event  where "+condition+" order by uploadtime asc";
	}
	var sql = "select * from event  where "+condition+" order by uploadtime asc";
	// console.log("------"+sql)
	// client.query(sql,function(err,resluts){
	// 	callback(err,resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
};

var selectAsDetailByUploadTime = function(uploadtime,callback){
	var sql = "select * from policy, project where uploadtime = "+uploadtime;
	// client.query(sql,function(err,resluts){
	// 	callback(err,resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}

var selectFromPolicyOrProjectByTime = function(tag,lasttime,callback){
	var table = "";
	if(tag == 0){
		table = " policy ";
	}else {
		table = " project ";
	}
	if(lasttime == 0){
		var sql = "select * from "+table+" order by uploadtime desc "+
			  " limit 6 ";
	}else{
		var sql = "select * from "+table+" order by uploadtime desc "+
			  " where uploadtime < "+lasttime+" limit 6 ";
	}
	// console.log("kkkk");
	// console.log(sql);

	// client.query(sql,function(err,resluts){
	// 	callback(err,resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();

	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}

var selectFromEventByRegeionid = function(id,callback){
	var sql = "select * from event where regionid = "+id;
	// client.query(sql,function(err,resluts){
	// 	callback(err,resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}

var selectFromEventByTime = function(id,tag,lasttime,callback){
	var sql = "";
	if(lasttime==0){
		sql = " select * from event "+
			  " where categoryid = "+tag+ 
			  " and regionid = "+id+
			  
			  " order by uploadtime desc "+
			  " limit 6 ";
	}else{
		sql = " select * from event "+
			  " where categoryid = "+tag+ 
			  " and regionid = "+id+
			  " and uploadtime < "+lasttime+
			  " order by uploadtime desc "+
			  " limit 6 ";
	}
	
	// console.log("===="+sql);
	// client.query(sql,function(err,resluts){
	// 	callback(err,resluts);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.release();
	    });

	    
	});
}
/* web end*/

var selectFromHistory = function(callback){
	var sql = "select content from history order by uploadtime desc limit 10";
	// client.query(sql,function(err,results){
	// 	callback(err,results);
	// });
	pool.getConnection(function(err,connection){
	    if (err) {
	      console.log(err.message);
	      connection.release();
	      return;
	    }   
//select count(*) as num from history;delete from history limit 90;	    
	    connection.query(sql, function(err, resluts){
	        
	        callback(err, resluts);
	        connection.query("select count(*) as num from history",function(err,results){
	        	if (err) {
			      console.log(err.message);
			      connection.release();
			      return;
			    }
			    if(results[0].num >= 100 ){
			    	connection.query("delete from history limit 90",function(err,results){
			    		connection.release();
			    	})
			    }
			    
	        })
	        
	    });
	    
	});
}


// exports.connect = connect;

exports.selectAsPagination = selectAsPagination;
exports.selectAsList = selectAsList;
exports.selectAsDetail = selectAsDetail;

exports.selectFromEventByType = selectFromEventByType;
exports.selectAsDetailFromEvent = selectAsDetailFromEvent;
exports.adminLoginUPValidate = adminLoginUPValidate;
exports.adminDatamanSelectAll = adminDatamanSelectAll;
exports.adminDatamanInserOne = adminDatamanInserOne;
exports.adminDatamanDeleteOne = adminDatamanDeleteOne;
exports.adminDatamanSearchKeyword = adminDatamanSearchKeyword;
exports.adminRegionSelectAllList = adminRegionSelectAllList;
exports.adminRegionAddBig = adminRegionAddBig;
exports.adminRegionAddSmall = adminRegionAddSmall;
exports.adminPolicySelectNumber = adminPolicySelectNumber;
exports.adminRegionSelectRegionIDandUserName = adminRegionSelectRegionIDandUserName;
exports.adminPolicySelectOne = adminPolicySelectOne;
exports.adminLoginupdateLoginTime = adminLoginupdateLoginTime;
exports.adminPolicyModifyOne = adminPolicyModifyOne;
exports.adminPolicyInsertOne = adminPolicyInsertOne;
exports.adminPolicySearch = adminPolicySearch;

exports.adminProjectModifyOne = adminProjectModifyOne;
exports.adminProjectInsertOne = adminProjectInsertOne;
exports.adminProjectSearch = adminProjectSearch;
exports.adminProjectSelectOne = adminProjectSelectOne;
exports.adminProjectSelectNumber = adminProjectSelectNumber;

exports.adminRegionDeleteOne = adminRegionDeleteOne;
exports.adminEventSelectAll = adminEventSelectAll;
exports.adminEventCategorys = adminEventCategorys;
exports.adminEventDelete = adminEventDelete;
exports.adminPolicyCount = adminPolicyCount;
exports.adminProjectCount = adminProjectCount;
exports.adminEventAddOne = adminEventAddOne;
exports.adminRegionSelectVillages = adminRegionSelectVillages;
exports.adminRegionSelectAllVillages = adminRegionSelectAllVillages;
exports.adminRegionSelectAllListWithTypeid = adminRegionSelectAllListWithTypeid;
exports.adminProjectDeleteOne = adminProjectDeleteOne;
exports.adminPolicyDeleteOne = adminPolicyDeleteOne;

/**web*/
exports.selectFromPolicyAsList = selectFromPolicyAsList;
exports.selectFromProjectAsList = selectFromProjectAsList;
exports.selectTownFromRegion = selectTownFromRegion;
exports.selectFromEventBySuperid = selectFromEventBySuperid;
exports.selectAsDetailByUploadTime = selectAsDetailByUploadTime;
exports.selectFromPolicyOrProjectByTime = selectFromPolicyOrProjectByTime;
exports.selectFromEventByRegeionid = selectFromEventByRegeionid;
exports.selectFromEventByTime = selectFromEventByTime;
exports.adminEventSelectOne = adminEventSelectOne;
exports.adminEventModifyOne = adminEventModifyOne;

exports.selectVillageFromRegion = selectVillageFromRegion;
exports.globalSearch = globalSearch;

exports.selectFromHistory = selectFromHistory;

exports.selectFromPolicyByIsmain = selectFromPolicyByIsmain;
// exports.end = end;

exports.pool = pool;
exports.adminEventDeleteBySuperid = adminEventDeleteBySuperid;
exports.adminEventDeleteByRegionid = adminEventDeleteByRegionid;
exports.selectFromMaintainerByName = selectFromMaintainerByName;
exports.selectFromRegionByName = selectFromRegionByName;
// exports.connection = connection;