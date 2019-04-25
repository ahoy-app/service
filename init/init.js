import mongoose from 'mongoose'
import mdb from '../src/config/mdb'
import User from '../src/model/User'
import { createGroupRoom } from '../src/model/Room'

mdb().then(async () => {
  try {
    const userBase = { role: 'user', crypto: { public: 'aaa', private: 'aaa' } }

    const mike = new User({ _id: 'mike', name: 'Mike', ...userBase })
    const hannah = new User({ _id: 'hannah', name: 'Hannah', ...userBase })
    const tom = new User({ _id: 'tom', name: 'Tom', ...userBase })

    await mike.save()
    await hannah.save()
    await tom.save()

    const main = createGroupRoom({
      admin: 'mike',
      name: 'main',
    })
    const football = createGroupRoom({
      admin: 'mike',
      name: 'football',
    })
    const dev = createGroupRoom({
      admin: 'mike',
      name: 'dev',
    })
    const chess = createGroupRoom({
      admin: 'mike',
      name: 'chess',
    })

    main.addUser(mike._id)
    main.addUser(hannah._id)
    main.addUser(tom._id)

    football.addUser(mike._id)
    football.addUser(hannah._id)

    dev.addUser(mike._id)
    dev.addUser(hannah._id)
    dev.addUser(tom._id)

    chess.addUser(hannah._id)

    await main.save()
    await football.save()
    await dev.save()
    await chess.save()

    mongoose.connection.close()
  } catch (error) {
    mongoose.connection.close()
  }
})
