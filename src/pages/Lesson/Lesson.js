import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authApi from '../../api/authApi';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import Iframe from 'react-iframe';
import { Table, Button } from 'antd';
import { CheckOutlined } from '@mui/icons-material';
import TakeQuiz from './TakeQuiz/TakeQuiz';

export default function Lesson() {
  const [listLesson, setListLesson] = useState([]);
  const [listQuiz, setListQuiz] = useState([]);
  const [courseID, setCourseID] = useState('');
  const [quizId, setQuizId] = useState('video');
  const [typeQuiz, setTypeQuiz] = useState('');
  const [url, setUrl] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    authApi
      .getLessonById(id)
      .then((response) => {
        setUrl(response.data.linkContent);
        setCourseID(response.data.course.id);
      })
      .catch((err) => {
        console.log(err);
      });
    authApi.findAllQuiz().then((response) => {
      setListQuiz(response.data.quizList);
    });
  }, [id]);

  useEffect(() => {
    if (courseID) {
      authApi
        .getLessonByCourseId(courseID)
        .then((response) => {
          setListLesson(response.data.lessonList);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [courseID]);

  const handleDone = (lessonId) => {};

  const handleQuiz = (type, quizId) => {
    // if ( type === 'View' ) {
    //   authApi.startQuiz
    // }
    setTypeQuiz(type);
    setQuizId(quizId);
  };

  const columns = [
    {
      title: 'List Lesson',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      align: 'center',
      render: (record) => {
        return (
          <div>
            <CheckOutlined />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Header />
      <h3>Course name</h3>
      <div className="row" style={{ marginBottom: '150px', marginTop: '30px' }}>
        <div>
          {quizId === 'video' ? (
            <div
              style={{
                marginTop: '20px',
                marginLeft: '20px',
              }}
            >
              <Iframe src={url} width="900px" height="480px" />
            </div>
          ) : (
            <TakeQuiz quizId={quizId} type={typeQuiz} />
          )}
        </div>
        <div style={{ position: 'absolute', right: '0' }}>
          <Table
            columns={columns}
            rowKey={(record) => record.id}
            pagination={{ position: ['bottomLeft'] }}
            onRow={(record) => ({ onClick: () => navigate(`/viewLesson/${record.id}`) })}
            expandable={{
              expandedRowRender: (record) => {
                const quiz = listQuiz.filter((quiz) => quiz.lesson.id === record.id);
                if (quiz.length !== 0) {
                  return (
                    <div style={{ alignContent: 'center', justifyContent: 'center', display: 'flex' }}>
                      <p style={{ textAlign: 'left', color: '#000' }}>
                        Quiz: {quiz[0].name}
                        <Button
                          style={{ width: '120px', marginLeft: '10px' }}
                          onClick={() => handleQuiz('Start', quiz[0].id)}
                        >
                          Start quiz
                        </Button>
                        <Button
                          style={{ width: '120px', marginLeft: '10px' }}
                          onClick={() => handleQuiz('View', quiz[0].id)}
                        >
                          View Best Quiz
                        </Button>
                      </p>
                    </div>
                  );
                } else {
                  return (
                    <div style={{ alignContent: 'center', justifyContent: 'center', display: 'flex' }}>
                      <Button style={{ textAlign: 'left', color: '#000' }} onClick={() => handleDone(record.id)}>
                        Click to complete
                      </Button>
                    </div>
                  );
                }
              },
            }}
            dataSource={listLesson}
          />
        </div>
      </div>

      <div style={{ marginTop: '250px' }}>
        <Footer />
      </div>
    </>
  );
}
