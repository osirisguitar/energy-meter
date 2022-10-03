const rpio = require('rpio')

rpio.open(15, rpio.INPUT, rpio.PULL_UP);

let last = null

function pollcb(pin)
{
        /*
         * Wait for a small period of time to avoid rapid changes which
         * can't all be caught with the 1ms polling frequency.  If the
         * pin is no longer down after the wait then ignore it.
         */
        rpio.msleep(2);

        if (rpio.read(pin))
                return;

	let now = Date.now()
	if (last)
	{
		console.log(3600/(now - last) + " kW")
	}
	
	last = now
}

rpio.poll(15, pollcb, rpio.POLL_LOW);
