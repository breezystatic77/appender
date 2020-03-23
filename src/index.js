require('dotenv-flow').config()
const express = require('express')
const serveIndex = require('serve-index')
const rateLimit = require('express-rate-limit')
const fs = require('fs')
const path = require('path')

const app = express()

app.use(express.static('public'))

app.use(
	'/f',
	express.static(process.env.FILES_DIR),
	serveIndex(process.env.FILES_DIR, {
		icons: false,
		template: 'templates/file.html'
	})
)

app.get(
	'/a/*',
	rateLimit({
		windowMs: process.env.WRITE_LIMIT_PERIOD,
		max: process.env.WRITE_LIMIT,
		message: "You're sending too many requests, please try again later."
	}),
	(req, res) => {
		if (!req.query.a) return res.send('Needs query "a"')
		const append = req.query.a

		if (append.length > 255)
			return res.send(
				'Append to long; max length is: ' + process.env.MAX_APPEND_LENGTH
			)

		let args = req.params[0].split('/')
		if (args[args.length - 1] == '') args.pop()

		if (!args[args.length - 1].endsWith('.txt'))
			args[args.length - 1] = args[args.length - 1] + '.txt'

		if (args.length > process.env.MAX_SUBFOLDERS)
			return res.send('Too many subfolders. Max: ' + process.env.MAX_SUBFOLDERS)

		let directoryArgs = args.slice(0, args.length)
		directoryArgs.pop()
		const directoryPath = path.join(process.env.FILES_DIR, ...directoryArgs)

		const filePath = path.join(process.env.FILES_DIR, ...args)

		fs.mkdirSync(directoryPath, { recursive: true })
		fs.appendFileSync(filePath, '\n' + append, {
			flag: 'a+'
		})
		console.log(req.ip, ':', args.join('/'), '---', append)
		res.status(200).json({
			ok: true,
			append
		})
	}
)

app.listen(process.env.PORT, () => {
	console.log('server listening on port', process.env.PORT)
})
