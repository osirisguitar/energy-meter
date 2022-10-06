const rpio = require('rpio')
const {InfluxDB} = require('@influxdata/influxdb-client')
const config = require('dotenv').config()

// You can generate an API token from the "API Tokens Tab" in the UI
const token = process.env.influx_token
const org = process.env.influx_org
const bucket = process.env.influx_bucket

const client = new InfluxDB({url: process.env.influx_url, token: token})

const {Point} = require('@influxdata/influxdb-client')
const writeApi = client.getWriteApi(org, bucket)
writeApi.useDefaultTags({host: 'host1'})

function writeValue(watt)
{
	const point = new Point('energy').floatField('kW', watt)
	writeApi.writePoint(point)
}

rpio.open(15, rpio.INPUT, rpio.PULL_DOWN);

let last = null

function pollcb(pin)
{
	rpio.msleep(2);

        if (!rpio.read(pin))
            return;

	let now = Date.now()
	if (last)
	{
		let kW = 3600/(now - last)
		console.log(kW + " kW")
		if (kW < 100) {
			writeValue(kW)
		} else {
			console.log('too big')
		}
	}
	
	last = now
}

rpio.poll(15, pollcb, rpio.POLL_HIGH);
