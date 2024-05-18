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
                  date={moment(item.createDate).format("YYYY-MM-DD HH:MM")}
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
                  <button
                    className="clickBtn"
                    onClick={() =>
                      navigate(`/${teamName}/${projectName}/${item.manageId}`)
                    }
                  >
                    view code
                  </button>
                </VerticalTimelineElement>
              ))}
            </VerticalTimeline>
          )}
    </div>
  );
}

export default CommitList;
