const express = require('express')
const router = express.Router();
const axios = require('axios')

module.exports = (function () {

	router.get('/EstimatedDailyResults',async (req, res) => {
		try {
			const response = await axios.get(`https://graph.facebook.com/${global.globalversion}/${global.globalAdAccountId}/reachestimate`, {
				params: {
					access_token: globalAccessToken,
					optimization_goal: "REACH",
					billing_event: "IMPRESSIONS",
					targeting_spec: JSON.stringify({
						geo_locations: {
							countries: ['US']
						},
						age_min: 18,
						age_max: 65
					}),
					bid_amount: 50000
				}
			});
	
			res.send(response.data);
		} catch (error) {
			console.error('Error fetching estimated daily results:', error.response ? error.response.data : error.message);
		}
	});
	async function get_access_token(){
		try{
			const response = await axios.get('https://open.larksuite.com/open-apis/auth/v3/app_access_token/internal',{
				app_id: "cli_a6e6b123de79d02f",
				app_secret: "N5Tr0ajVQdd5q6EKnzEXHbcDhFLrUAS6"
			})
			const access_token = response.data.app_access_token;
			console.log("access_token: ", access_token);
			return access_token;
		}catch(err){
			console.log("error: "+ err);
		}	
	}
	async function get_list_orders(){
		try{
			const response = await axios.get('http://localhost/wordpress/wp-json/myplugin/v1/orders');
			const list_order = response.data;
			return list_order;
		}catch(err){
			console.log("error: "+ err);
		}	
	}
	router.get("/get_list_order", async(req, res)=>{
			try{
			const response = await axios.get('http://localhost/wordpress/wp-json/myplugin/v1/orders');
			const list_order = response.data;
			res.send(list_order);
		}catch(err){
			res.send("error: "+ err);
		}	
	})
	router.get('/list_order', async(res,req)=>{
			try{
				const response = axios.post("https://open.larksuite.com/open-apis/bitable/v1/apps/:app_token/tables/:table_id/records/:record_id",{
					headers: {
						'Authorization': `Bearer ${get_access_token()}`,
						'Content-Type': 'application/json'
					},
					fields: {
						"id": get_list_orders.id,
						"name": get_list_orders.customer_name,
						"date": get_list_orders.date,
						
						"linhvuckinhdoanh": "{{linhvuckinhdoanh}}",
						"soluongdata": "{{soluongdata}}",
						"soluongdonhang": "{{soluongdonhang}}",
						"message": "{{message}}"
					}	
				})
			}catch(err){
				console.log("error: "+ err);
			}
		})
	return router; 
})();


