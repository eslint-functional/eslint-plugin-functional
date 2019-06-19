import * as ts from "typescript";
import * as Lint from "tslint";
import * as utils from "tsutils/typeguard/2.8";
import {
  createInvalidNode,
  CheckNodeResult,
  createCheckNodeRule
} from "./shared/check-node";

type Options = {};

export const Rule = createCheckNodeRule(
  checkNode,
  "Only the same kind of members allowed in interfaces."
);

function checkNode(
  node: ts.Node,
  _ctx: Lint.WalkContext<Options>
): CheckNodeResult {
  const invalidNodes = [];
  if (utils.isInterfaceDeclaration(node)) {
    let prevMemberKind: number | undefined = undefined;
    let prevMemberType: number | undefined = undefined;
    for (const member of node.members) {
      const memberKind = member.kind;
      let memberType = 0;
      // If it is a property declaration we need to check the type too
      if (
        utils.isPropertySignature(member) &&
        member.type &&
        utils.isFunctionTypeNode(member.type)
      ) {
        // We only set memberType for Functions
        memberType = member.type.kind;
      }
      if (
        prevMemberKind !== undefined &&
        (prevMemberKind !== memberKind || prevMemberType !== memberType)
      ) {
        invalidNodes.push(createInvalidNode(member, []));
      }
      prevMemberKind = memberKind;
      prevMemberType = memberType;
    }
  }
  return { invalidNodes };
}
