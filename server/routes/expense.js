var mongoose = require( 'mongoose' );
var Expense = require('../models/expense');
var config = require('../config');

exports.saveexpense = function(req, res, next){
    const uid = req.params.id;
    const dt = req.body.expdate;
    const typ = req.body.expaccount;
    const amt = req.body.expamt;
    const desc = req.body.expdesc;
    const expid = req.body.expid;

    if (!uid || !dt || !typ || !amt) {
        return res.status(422).send({ success: false, message: 'Posted data is not correct or incompleted.' });
    } else {
		
	if (expid) {
		//Edit expense
		Expense.findById(expid).exec(function(err, expense){
			if(err){ res.status(400).json({ success: false, message: 'Error processing request '+ err }); }
				
			if(expense) {
				expense.expensedate = dt;
				expense.expensetype = typ;
				expense.expenseamt = amt;
				expense.expensedesc = desc;
			}
			expense.save(function(err) {
				if(err){ res.status(400).json({ success: false, message: 'Error processing request '+ err }); }
				res.status(201).json({
					success: true,
					message: 'Expense updated successfully'
				});
			});
		});

	}else{
		
		// Add new expense
		let oExpense = new Expense({
			userid: uid,
			expensedate: dt,
			expensetype: typ,
			expenseamt: amt,
			expensedesc: desc
		});

		oExpense.save(function(err) {
			if(err){ res.status(400).json({ success: false, message: 'Error processing request '+ err }); }
				
			res.status(201).json({
				success: true,
				message: 'Expense saved successfully'
			});
		});

	}
    }
}

exports.delexpense = function(req, res, next) {
	Expense.remove({_id: req.params.id}, function(err){
        if(err){ res.status(400).json({ success: false, message: 'Error processing request '+ err }); }
        res.status(201).json({
		success: true,
		message: 'Expense removed successfully'
	});
    });
}

exports.getexpense = function(req, res, next){
	Expense.find({_id:req.params.id}).exec(function(err, expense){
        if(err){ res.status(400).json({ success: false, message:'Error processing request '+ err }); 
        }
        res.status(201).json({
		success: true, 
		data: expense
	});
    });
}

exports.expensetotal = function(req, res, next){
    const uid = req.params.id || req.param('uname');
    const rptype = req.body.report || req.param('report');
    const from_dt = req.body.startdt || req.param('startdt');
    const to_dt = req.body.enddt || req.param('enddt');
    const fromdt = new Date(from_dt);
    const todt = new Date(to_dt);
    
    let match = {};
    
    if(rptype === 'opt1'){
        let oDt = new Date();
        let month = oDt.getUTCMonth() + 1; //months from 1-12
        let year = oDt.getUTCFullYear();

        let fdt = new Date(year + "/" + month + "/1");
        let tdt = new Date(year + "/" + month + "/31");

        match = { "$match": {userid:uid, expensedate:{$gte: fdt, $lte: tdt}} };

    } else if (rptype === 'opt2'){
        match = { "$match": { userid:uid, expensedate:{$gte: fromdt, $lte: todt}} };
    } else {
        match = { "$match": { userid:uid } };
    }
    
    Expense.aggregate([
        match,
        { "$group": {
            "_id": 1,
            "total": { "$sum": "$expenseamt" }
        }}
    ],
    function(err, result) {
        if(err){ res.status(400).json({ success: false, message:'Error processing request '+ err }); }
        res.status(201).json({
		success: true, 
		data: result
	});
    })
    
}

exports.expensereport = function(req, res, next){
    const uid = req.params.id || req.query.uname;
    const rptype = req.body.report || req.query.report;
    const from_dt = req.body.startdt || req.query.startdt;
    const to_dt = req.body.enddt || req.query.enddt;
    const fromdt = new Date(from_dt);
    const todt = new Date(to_dt);

    let limit = parseInt(req.query.limit);
    let page = parseInt(req.body.page || req.query.page);
    let sortby = req.body.sortby || req.query.sortby;
    let query = {};

    if(!limit || limit < 1) {
	limit = 10;
    }

    if(!page || page < 1) {
	page = 1;
    }

    if(!sortby) {
	sortby = 'expensedate';
    }

    var offset = (page - 1) * limit;

    if (!uid || !rptype) {
        return res.status(422).send({ error: 'Posted data is not correct or incompleted.'});
	}else if(rptype === 'opt2' && !fromdt && !todt){
		return res.status(422).send({ error: 'From or To date missing.'});
	}else if(fromdt > todt){   
		 return res.status(422).send({ error: 'From date cannot be greater than To date.'});
	}else{

		if(rptype === 'opt1'){
			// returns records for the current month
			let oDt = new Date();
			let month = oDt.getUTCMonth() + 1; //months from 1-12
			let year = oDt.getUTCFullYear();

			let fdt = new Date(year + "/" + month + "/1");
			let tdt = new Date(year + "/" + month + "/31");
	
			query = { userid:uid, expensedate:{$gte: fdt, $lte: tdt} };

			Expense.count(query, function(err, count){
				if(count > offset){
					offset = 0;
				}
			});

		} else if (rptype === 'opt2'){
			// return records within given date range
			query = { userid:uid, expensedate:{$gte: fromdt, $lte: todt} };

			Expense.count(query, function(err, count){
				if(count > offset){
					offset = 0;
				}
			});

		} else {
			// returns all expense records for the user
			query = { userid:uid };

			Expense.count(query, function(err, count){
				if(count > offset){
					offset = 0;
				}
			});
		}

		var options = {
			select: 'expensedate expensetype expenseamt expensedesc',
			sort: sortby,
			offset: offset,
			limit: limit
		}

		Expense.paginate(query, options).then(function(result) {
			res.status(201).json({
				success: true, 
				data: result
			});
		});
	}
}
