
import User from "../models/user.js";


export const getCouncilData = async (req, res) => {
    try {

        const getMembers = await User.find({role: 'STUDENT_COUNCIL'})
                                    .select('name email avatar councilPosition onlineStatus className')
        const members = getMembers.map(member => ({
        name: member.name,
        email: member.email,
        avatar: member.avatar,
        councilPosition: member.councilPosition,
        onlineStatus: member.onlineStatus,
        className: member.className || null,
        }));
        console.log("getMembers: ", getMembers);
        
        console.log("Members: ", members);
        res.status(200).json({
            success: true,
            members,
            message: "Fetching Council Data Successful!"
        })

    } catch (error) {
        res.status(500).json({message: "Error fetching council data"})
    }
} 

