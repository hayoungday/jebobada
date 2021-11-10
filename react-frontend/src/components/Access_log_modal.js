import React, { Component } from 'react';
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Access_log from "./Access_log";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import CircularProgress from "@material-ui/core/CircularProgress";

function Access_log_modal({ className, visible, children, closeModal, accessLog }) {

  const modal_contents = () => {
    return (
      <div>
          <button className="close_icon_login" onClick={closeModal}/>
          <h1>로그인 기록 보기</h1>
            <h3>로그인 등 활동 기록을 확인할 수 있습니다.</h3>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>일시</TableCell>
                  <TableCell>로그인IP</TableCell>  
                  <TableCell >로그인</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>  
                {accessLog ? (
                  accessLog.map((c, i) => {
                    return (
                      <Access_log
                        access_time={c.access_time}
                        access_ip={c.access_ip}
                        login={c.login}
                      />
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan="6" align="center">
                      <br></br>
                      <h6>loading....</h6>
                      <br></br>
                      <br></br>
                      <CircularProgress
                        variant="indeterminate"
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
       </div>
      );
    }

    return (
      <>
        <ModalOverlay visible={visible} />
        <ModalWrapper className={className} tabIndex="-1" visible={visible}>
          <ModalInner tabIndex="0" className="modal-inner">
            {children}
            {modal_contents()}
          </ModalInner>
        </ModalWrapper>
      </>
    )
  }
  
  Access_log_modal.propTypes = {
    visible: PropTypes.bool,
    closeModal: PropTypes.func,
    accessLog: PropTypes.array,
  }
  
  const ModalWrapper = styled.div`
    box-sizing: border-box;
    display: ${(props) => (props.visible ? 'block' : 'none')};
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    overflow: auto;
    outline: 0;
  `
  
  const ModalOverlay = styled.div`
    box-sizing: border-box;
    display: ${(props) => (props.visible ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 999;
  `
  
  const ModalInner = styled.div`
    box-sizing: border-box;
    position: relative;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
    background-color: #fff;
    border-radius: 10px;
    width: 1000px;
    height: 800px;
    max-width: 600px;
    top: 50%;
    transform: translateY(-50%);
    margin: 0 auto;
    padding: 40px 20px;
    overflow: scroll;
    
  `

export default Access_log_modal;