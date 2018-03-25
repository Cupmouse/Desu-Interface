// const REGEX_ARGS_EXTRACTOR = /(:.+?)(?:\/|$)/g;

export const PATH_TEMPLATE_BOARD_THREAD_LIST = '/board/:boardAddress/threads';
export const PATH_TEMPLATE_BOARD_NEW_THREAD = '/board/:boardAddress/new-thread';
export const PATH_TEMPLATE_THREAD = '/thread/:threadAddress/';

const replaceTemplateArgs = (template, argsMap) => {
  let replacedPath = template;

  Object.keys(argsMap).forEach((argName) => {
    replacedPath = replacedPath.replace(`:${argName}`, argsMap[argName]);
  });

  return replacedPath;
};

export const genPathToBoard = boardAddress =>
  replaceTemplateArgs(PATH_TEMPLATE_BOARD_THREAD_LIST, { boardAddress });

export const genPathToThread = threadAddress =>
  replaceTemplateArgs(PATH_TEMPLATE_THREAD, { threadAddress });

export const genPathToNewThread = boardAddress =>
  replaceTemplateArgs(PATH_TEMPLATE_BOARD_NEW_THREAD, { boardAddress });

