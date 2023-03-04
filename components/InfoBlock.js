import {
    Text, UnorderedList, ListItem,
} from '@chakra-ui/react';
import {invertColor} from "../utils/utils";

function InfoBlock() {
    return (true ? null :
        <>
            <Text align={"justify"} mb={2}>
                At MilMove reviews, you are not limited to writing reviews months later, after your
                shipment has been delivered.
                <Text>With our reviews, we give you the possibility to review your shipment and share it with other
                    service members in real-time. We allow you to review each component of your move in real-time.
                    This
                    starts with the pre-move survey, the packing and loading of your shipment, your experience with
                    keeping
                    track of your shipment, communications, timeliness of responses, your experience with the
                    delivery, and
                    finally, your critique of the claims process.</Text>
            </Text>
            <Text align={"justify"} mb={2}>Aside from publishing your review for others to see anonymously, you can
                allow us to
                send your
                critique to the transportation service provider, the agent that packed and loaded your shipment, or the
                delivery agent. Once the appropriate service provider has been notified, they can reply.</Text>
            <Text align={"justify"} color={invertColor('teal.800')}>Why is reviewing your shipment at MilMove reviews
                different from completing the
                customer service in
                the military DPS system?</Text>
            <UnorderedList>
                <ListItem>First, you can submit your critique when all is fresh in your mind.</ListItem>
                <ListItem>Second, reviews you submit to the military DPS system are not published. Other service
                    members will not be able
                    to see reviews of the services you were provided. Imagine not being able to see product reviews
                    on
                    Amazon.com before you buy!</ListItem>
                <ListItem>And lastly, several subcontractors will usually be involved with the handling
                    of your shipments. One company may pack your shipment, another may transport it to the
                    destination, and
                    another company may deliver your shipment!</ListItem>
            </UnorderedList>
            <Text align={"justify"}>
                We have constructed our reviews so that each part of your
                shipment review is directly connected to the company or subcontractor responsible for that portion of
                your move.</Text>
            <Text align={"justify"}>During the review process, we’ll ask you to provide some information regarding the
                transportation
                service provider your shipment was booked with, the subcontractor that packed your shipment, and the
                subcontractor that delivered your shipment.</Text>
        </>
    )
}

export default InfoBlock;
