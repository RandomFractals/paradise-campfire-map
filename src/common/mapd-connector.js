import MapDCon from '@mapd/connector/dist/browser-connector';

// mapd back-end connection setup
const connector = new window.MapdCon();
let savedConnection = null;

function establishConnection(config) {
  return new Promise((resolve, reject) => {
    connector
      .host(config.host)
      .port(config.port)
      .dbName(config.database)
      .user(config.username)
      .password(config.password)
      .connect((error, connection) => {
        if (error) {
          reject(error);
        } else if (connection) {
          console.log('mapd-connector:connection:', connection);
          resolve(connection);
        }
      })
  })
}

async function getConnection(config) {
  try {
    return await establishConnection(config);
  } catch(error) {
    return error;
  }
}

async function getConnectionStatus(connection) {
  try {
    return await connection.getStatusAsync();
  } catch(error) {
    return error;
  }
}

// store the connection once we've established it
function saveConnection(connection) {
  savedConnection = connection;
}

async function getData(query) {
  // console.log('mapd-connector:getData(): query:', query);
  return await savedConnection.queryAsync(query);
}

async function renderVega (vegaSpec, vegaOptions = {returnTiming: true}) {
  return await new Promise((resolve, reject) => {
    savedConnection.renderVega(1, JSON.stringify(vegaSpec), vegaOptions, function(error, result) {
      if (error) {
        reject(error.message);
      } else {
        console.log('mapd-connector:renderVega(): exe:', result.execution_time_ms,
          'render:', result.render_time_ms, 'total:', result.total_time_ms, '(ms)');
        const blobUrl = `data:image/png;base64,${result.image}`;
        resolve(blobUrl);
      }
    })
  });
}

export {
  getConnection,
  getConnectionStatus,
  saveConnection,
  getData,
  renderVega
};
