var Sequelize = require('sequelize');
// var HOST = '127.0.0.1';
// var PORT = '3306';
// var USER = 'root';
// var PASSWORD = '123456';
// var DATABASE = 'pinyuan';
// var DBTYPE = 'mysql';
var sequelize = new Sequelize('mysql://root:123456@127.0.0.1:3306/pinyuan');

/*
var  = sequelize.define('',
	{
		id:{
			type:Sequelize.BIGINT(11),
			primaryKey: true 
		},
		


	},

	{
		timestamps:false,
		freezeTableName:true
	}
);
*/

//维护人员对象
var  maintainer = sequelize.define('maintainer',
	{
		id:{
			type:Sequelize.BIGINT(11),
			primaryKey: true 
		},
		name:{
			type:Sequelize.STRING(50)
		}, //varchar 50 	数据维护人员名
		passwd:{
			type:Sequelize.STRING(50)
		},// varchar 50	密码
		regionid:{
			type:Sequelize.BIGINT(11)
		}, //int 11		乡镇id
		typeid:{
			type:Sequelize.BIGINT(11)
		}, //int 11		管理员类型
		lastlogintime:{
			type:Sequelize.STRING(50)
		} //varchar 50 最后登录时间
	},

	{
		timestamps:false,
		freezeTableName:true
	}

);

//维护人员类型
var  type = sequelize.define('type',
	{
		id:{
			type:Sequelize.BIGINT(11),
			primaryKey: true 
		},
		typename:{
			type:Sequelize.STRING(50)
		}//超级管理员1／数据管理员2
	},

	{
		timestamps:false,
		freezeTableName:true
	}

);
//乡镇街道表
var  region = sequelize.define('region',
	{
		id:{
			type:Sequelize.BIGINT(11),
			primaryKey: true 
		},
		name:{
			type:Sequelize.STRING(50)
		},// varchar 50 	地区名
		super:{
			type:Sequelize.BIGINT(11)
		} 	//int 11		上级地区id（如果是村庄，则为上级的乡镇id；如果是乡镇，置为0）
		


	},

	{
		timestamps:false,
		freezeTableName:true
	}

);
//惠农政策表
var  policy = sequelize.define('policy',
	{
		id:{
			type:Sequelize.BIGINT(11),
			primaryKey: true 
		},
		title:{
			type:Sequelize.STRING(50)
		},// varchar 50 	政策名称
		content:{
			type:Sequelize.TEXT
		},// longtext	政策内容
		image:{
			type:Sequelize.STRING(100)
		},// varchar 100	图片
		ismain:{
			type:Sequelize.BIGINT(11)
		},// int 11		是否轮播：是1/否0
		uploadtime:{
			type:Sequelize.STRING(50)
		}// varchar 50 发布时间


	},

	{
		timestamps:false,
		freezeTableName:true
	}

);
//惠农项目表
var  project = sequelize.define('project',
	{
		id:{
			type:Sequelize.BIGINT(11),
			primaryKey: true 
		},
		title:{
			type:Sequelize.STRING(50)
		},// varchar 50 	项目名称
		content:{
			type:Sequelize.TEXT
		},// longtext	项目内容
		image:{
			type:Sequelize.STRING(100)
		},// varchar 100	图片
		ismain:{
			type:Sequelize.BIGINT(11)
		},// int 11		是否轮播：是1/否0
		uploadtime:{
			type:Sequelize.STRING(50)
		}// varchar 50 发布时间


	},

	{
		timestamps:false,
		freezeTableName:true
	}

);
//村务内容表
var  event = sequelize.define('event',
	{
		id:{
			type:Sequelize.BIGINT(11),
			primaryKey: true 
		},
		title:{
			type:Sequelize.STRING(50)
		},// varchar 50 	村务名称
		content:{
			type:Sequelize.TEXT
		},// longtext	村务内容
		image:{
			type:Sequelize.STRING(100)
		},// varchar 100	图片
		regionid:{
			type:Sequelize.BIGINT(11)
		},// int 11		
		categoryid:{
			type:Sequelize.BIGINT(11)
		},
		uploadtime:{
			type:Sequelize.STRING(50)
		}// varchar 50 发布时间


	},

	{
		timestamps:false,
		freezeTableName:true
	}

);
//村务类型
var category = sequelize.define('category',
	{
		id:{
			type:Sequelize.BIGINT(11),
			primaryKey: true 
		},
		type:{
			type:Sequelize.STRING(50)
		}
	},
	
	{
		timestamps:false,
		freezeTableName:true
	}
);

exports.maintainer = maintainer;
exports.type = type;
exports.region = region;
exports.policy = policy;
exports.project = project;
exports.event = event;
exports.category = category;
