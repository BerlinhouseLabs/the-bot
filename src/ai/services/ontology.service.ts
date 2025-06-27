import {
  EdgeType,
  EntityType,
  entityFields,
} from '@getzep/zep-cloud/wrapper/ontology';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OntologyService {
  getCustomEntityTypes() {
    const FloorSchema: EntityType = {
      description: 'Represents a physical floor in the Frontier Tower.',
      fields: {
        floor_number: entityFields.integer('The number of the floor.'),
        theme: entityFields.text(
          "The theme or focus of the floor, e.g., 'AI & Autonomous Systems'.",
        ),
      },
    };

    const CommunitySchema: EntityType = {
      description:
        'Represents a community or sub-community within the Frontier Tower.',
      fields: {
        focus_area: entityFields.text(
          'The primary focus area of the community.',
        ),
      },
    };

    const ProjectSchema: EntityType = {
      description: 'A project being worked on by a user or community.',
      fields: {
        status: entityFields.text(
          "The current status of the project (e.g., 'in-progress', 'completed').",
        ),
      },
    };

    const EventSchema: EntityType = {
      description:
        'An event, workshop, or hackathon happening at the Frontier Tower.',
      fields: {
        date: entityFields.text('The date and time of the event.'),
        location: entityFields.text(
          'The location of the event, usually a floor name.',
        ),
      },
    };

    const InterestSchema: EntityType = {
      description: "A user's professional or personal interest.",
      fields: {
        category: entityFields.text(
          "The category of the interest, e.g., 'Technology', 'Arts'.",
        ),
      },
    };

    return {
      Floor: FloorSchema,
      Community: CommunitySchema,
      Project: ProjectSchema,
      Event: EventSchema,
      Interest: InterestSchema,
    };
  }

  getCustomEdgeTypes() {
    const MemberOfEdge: EdgeType = {
      description: 'Connects a User to a Community they are a member of.',
      fields: {
        joined_date: entityFields.text(
          'The date when the user joined the community.',
        ),
        role: entityFields.text(
          'The role of the user in the community (e.g., "member", "admin").',
        ),
      },
      sourceTargets: [{ source: 'User', target: 'Community' }],
    };

    const InterestedInEdge: EdgeType = {
      description:
        "Indicates a User's interest in a topic, floor, or community.",
      fields: {
        interest_level: entityFields.text(
          'The level of interest (e.g., "high", "medium", "low").',
        ),
        date_added: entityFields.text('The date when the interest was added.'),
      },
      sourceTargets: [
        { source: 'User', target: 'Interest' },
        { source: 'User', target: 'Floor' },
        { source: 'User', target: 'Community' },
      ],
    };

    const WorksOnEdge: EdgeType = {
      description: 'Connects a User to a Project they are working on.',
      fields: {
        start_date: entityFields.text(
          'The date when the user started working on the project.',
        ),
        contribution_type: entityFields.text(
          'The type of contribution (e.g., "developer", "designer", "manager").',
        ),
      },
      sourceTargets: [{ source: 'User', target: 'Project' }],
    };

    const LocatedOnEdge: EdgeType = {
      description: 'Connects a Community or Project to a physical Floor.',
      fields: {
        assigned_date: entityFields.text(
          'The date when the entity was assigned to this floor.',
        ),
        space_type: entityFields.text(
          'The type of space (e.g., "office", "lab", "meeting room").',
        ),
      },
      sourceTargets: [
        { source: 'Community', target: 'Floor' },
        { source: 'Project', target: 'Floor' },
      ],
    };

    const AttendsEdge: EdgeType = {
      description: 'Connects a User to an Event they are attending.',
      fields: {
        registration_date: entityFields.text(
          'The date when the user registered for the event.',
        ),
        attendance_status: entityFields.text(
          'The attendance status (e.g., "registered", "confirmed", "attended").',
        ),
      },
      sourceTargets: [{ source: 'User', target: 'Event' }],
    };

    return {
      MEMBER_OF: MemberOfEdge,
      INTERESTED_IN: InterestedInEdge,
      WORKS_ON: WorksOnEdge,
      LOCATED_ON: LocatedOnEdge,
      ATTENDS: AttendsEdge,
    };
  }
}
