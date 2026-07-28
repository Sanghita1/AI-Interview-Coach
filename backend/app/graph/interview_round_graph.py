from langgraph.graph import (
    StateGraph,
    END,
)

from app.graph.state import InterviewState

from app.graph.nodes import (
    evaluate_answer_node,
    generate_question_node,
    generate_followup_node,
    decide_next_step,
    complete_interview_node
)

builder = StateGraph(InterviewState)

builder.add_node(
    "evaluate_answer",
    evaluate_answer_node,
)

builder.add_node(
    "generate_question",
    generate_question_node,
)

builder.add_node(
    "generate_followup",
    generate_followup_node,
)

builder.add_node(
    "complete",
    complete_interview_node,
)

builder.set_entry_point(
    "evaluate_answer"
)

builder.add_conditional_edges(
    "evaluate_answer",
    decide_next_step,
    {
        "followup": "generate_followup",
        "next_question": "generate_question",
        "complete": "complete"
    }
)

builder.add_edge(
    "generate_followup",
    END,
)

builder.add_edge(
    "generate_question",
    END,
)

builder.add_edge(
    "complete",
    END,
)

interview_round_graph = builder.compile()