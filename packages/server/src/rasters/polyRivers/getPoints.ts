import { RawRiver, RawRiverPoints, NextPoints, Endpoints } from "./types";

const createPointId = (riverId: string, index: number) => {
  return `${riverId},${index}`;
};

export const getPoints = (rivers: RawRiver[]) => {
  const riversById: { [riverId: string]: RawRiver } = rivers.reduce(
    (byId: { [S: string]: RawRiver }, river) => {
      byId[river.id] = river;
      return byId;
    },
    {}
  );
  const nextPoints: NextPoints = {};
  const points: RawRiverPoints = {};
  const endpointIds: Endpoints = [];

  // rivers go upstream -> downstream
  rivers.forEach((river) =>
    river.geom.coordinates.forEach((coords, i) => {
      const nextIndex = i + 1;
      const myId = createPointId(river.id, i);

      if (nextIndex < rivers.length)
        var nextId = createPointId(river.id, nextIndex);
      else if (riversById[river.downstreamId])
        var nextId = createPointId(river.downstreamId, 0);

      if (i === 0 && (!river.upstreamId || !riversById[river.upstreamId]))
        endpointIds.push(myId);

      if (nextId) nextPoints[myId] = nextId;
      points[myId] = coords;
    })
  );

  return { endpointIds, nextPoints, points };
};
