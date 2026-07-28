from langgraph.graph import (
    StateGraph,
    END
)

from app.graph.state import (
    InterviewState
)

from app.graph.nodes import (
    generate_plan_node,
    generate_question_node,
    evaluate_answer_node
)

builder = StateGraph(
    InterviewState
)

builder.add_node(

    "generate_plan",

    generate_plan_node

)

builder.add_node(
    "generate_question",
    generate_question_node
)

builder.add_node(
    "evaluate_answer",
    evaluate_answer_node
)

builder.set_entry_point(
    "generate_plan"
)

builder.add_edge(
    "generate_plan",
    "generate_question"
)

builder.add_edge(
    "generate_question",
    END
)

# builder.add_edge(
#     "generate_question",
#     "evaluate_answer"
# )

# builder.add_edge(
#     "evaluate_answer",
#     END
# )

interview_graph = builder.compile()

