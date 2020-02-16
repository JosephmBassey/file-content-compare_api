import User from '../api/user/Models'


async function seedUser(params) {
    const user = await User.countDocuments()
    if (!user) {
        const newuser = new User({
            fullName: "John Doe",
            username: "userjohn",
            password: "superPassword",
        })
        await newuser.save()
        console.log('new User save ', {
            username: "userjohn",
            password: "superPassword",
        })
    }
}

export default seedUser