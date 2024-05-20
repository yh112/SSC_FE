import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import moment from "moment";
import "moment/locale/ko";
function CommitList({ commitList, teamName, projectName, isOpened }) {

  let navigate = useNavigate();

  return (
    <div>
      {isOpened && (
        <VerticalTimeline className="timeline">
          {commitList?.map((item, index) => (
            <VerticalTimelineElement
              key={index}
              date={moment(item.createDate).format("YYYY-MM-DD HH:mm")}
              dateClassName="dateClass"
              iconStyle={{ background: "#FF7A00", color: "#000" }}
              contentStyle={{ background: "#FF7A00", color: "#000" }}
              contentArrowStyle={{ borderRight: `7px solid #FF7A00` }}
              position="right"
            >
              <h3 className="vertical-timeline-element-title">
                {teamName}
              </h3>
              <h4
                className="vertical-timeline-element-subtitle"
                style={{ opacity: "60%" }}
              >
                {projectName}
              </h4>
              <p>#{item.comment}</p>
              <div className="btnBox">
                <button
                  className="clickBtn"
                  onClick={() =>
                    navigate(`/${teamName}/${projectName}/${item.manageId}`)
                  }
                >
                  view code
                </button>
                <button
                  className="clickBtn"
                  onClick={() =>
                    navigate(`/editor/${teamName}/${projectName}/${item.manageId}`)
                  }
                >
                  start share
                </button>
              </div>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      )}
    </div>
  );
}

export default CommitList;
