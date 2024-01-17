import cn.hutool.core.io.FileUtil;
import cn.hutool.http.HttpUtil;
import cn.hutool.json.JSONUtil;
import cn.hutool.log.Log;
import cn.hutool.log.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.URLDecoder;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

/**
 * 获取echarts图片
 * 常用
 1、getTempChartImgUrl 获取临时图片URL
 2、getChartImgUrl 获取持久化图片URL
 3、getChartImgBase64 获取图片base64字符串
 4、getChartImgFile 获取图片文件
 * 可修改配置
 # 图片默认宽度
 echarts.service.width=800
 # 图片默认高度
 echarts.service.height=400
 # 图片默认像素大小
 echarts.service.pixelRatio=2
 # 图片默认主题
 echarts.service.theme=vintage
 # 图片项目名称，用于区分项目
 echarts.service.appName=yourAppName
 # 本地存储图片的目录，相对于class
 echarts.service.echartsImg=imgFile
 # echarts服务接口地址
 echarts.service.url=http://192.168.23.92:3000
 * 文档地址 http://192.168.23.92:3000/doc
 */
@Service
public class EchartService {
	private static Log logger = LogFactory.get();

	@Value("${echarts.service.url:http://192.168.23.92:3000}")
	private String SERVICE_URL;

	@Value("${echarts.service.appName:#{null}}")
	private String APP_NAME;

	@Value("${echarts.service.width:600}")
	private int WIDTH;

	@Value("${echarts.service.height:400}")
	private int HEIGHT;

	@Value("${echarts.service.pixelRatio:1}")
	private String PIXEL_RATIO;

	@Value("${echarts.service.theme:}")
	private String THEME;

	@Value("${echarts.service.fileDir:echartsImg}")
	private String FILE_DIR;

	/**
	 * 获取echarts图片的URL地址
	 * @param params { options: string} 必传， 其他参数查看文档 http://192.168.23.92:3000/doc#tab=url
	 * @return 图片URL地址，失败则返回null
	 */
	public String getChartImgUrl(Map<String, Object> params) {
		String imgUrl = null;
		String result = HttpUtil.post(SERVICE_URL + "/api/url", params);
		Map res = JSONUtil.parseObj(result);
		if (!"200".equals(res.get("code").toString())) {
			logger.error("获取图片URL失败！" + JSONUtil.toJsonPrettyStr(res));
		} else {
			imgUrl = res.get("data").toString();
		}
		return imgUrl;
	}

	/**
	 * 获取临时图片URL，有效三天
	 * @param options 含变量option的js代码
	 * @param fileName 文件名
	 * @param width 图片宽
	 * @param height 图片高度度
	 * @param pixelRatio 分辨率
	 * @param theme echarts主题
	 * @return 图片URL，失败则返回null
	 */
	public String getTempChartImgUrl(String options, String fileName, int width, int height, String pixelRatio, String theme) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		params.put("fileName", fileName);
		params.put("height", height);
		params.put("width", width);
		params.put("pixelRatio", pixelRatio);
		params.put("theme", theme);
		return this.getChartImgUrl(params);
	}

	/**
	 * 获取临时图片URL，有效三天
	 * @param options 含变量option的js代码
	 * @param fileName 文件名
	 * @param width 图片宽
	 * @param height 图片高度度
	 * @param pixelRatio 分辨率
	 * @return 图片URL，失败则返回null
	 */
	public String getTempChartImgUrl(String options, String fileName, int width, int height, String pixelRatio) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		params.put("fileName", fileName);
		params.put("height", height);
		params.put("width", width);
		params.put("pixelRatio", pixelRatio);
		params.put("theme", THEME);
		return this.getChartImgUrl(params);
	}

	/**
	 * 获取临时图片URL，有效三天
	 * @param options 含变量option的js代码
	 * @param fileName 文件名
	 * @param width 图片宽
	 * @param height 图片高度度
	 * @return 图片URL，失败则返回null
	 */
	public String getTempChartImgUrl(String options, String fileName, int width, int height) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		params.put("fileName", fileName);
		params.put("height", height);
		params.put("width", width);
		params.put("pixelRatio", PIXEL_RATIO);
		params.put("theme", THEME);
		return this.getChartImgUrl(params);
	}

	/**
	 * 获取临时图片URL，有效三天
	 * @param options 含变量option的js代码
	 * @param width 图片宽
	 * @param height 图片高度度
	 * @return 图片URL，失败则返回null
	 */
	public String getTempChartImgUrl(String options, int width, int height) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		params.put("height", height);
		params.put("width", width);
		params.put("pixelRatio", PIXEL_RATIO);
		params.put("theme", THEME);
		return this.getChartImgUrl(params);
	}

	/**
	 * 获取临时图片URL，有效三天
	 * @param options 含变量option的js代码
	 * @param fileName 文件名
	 * @return 图片URL，失败则返回null
	 */
	public String getTempChartImgUrl(String options, String fileName) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		params.put("fileName", fileName);
		params.put("height", HEIGHT);
		params.put("width", WIDTH);
		params.put("pixelRatio", PIXEL_RATIO);
		params.put("theme", THEME);
		return this.getChartImgUrl(params);
	}

	/**
	 * 获取临时图片URL，有效三天
	 * @param options 含变量option的js代码
	 * @return 图片URL，失败则返回null
	 */
	public String getTempChartImgUrl(String options) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		params.put("height", HEIGHT);
		params.put("width", WIDTH);
		params.put("pixelRatio", PIXEL_RATIO);
		params.put("theme", THEME);
		return this.getChartImgUrl(params);
	}

	/**
	 * 获取持久化图片URL
	 * @param options 含变量option的js代码
	 * @param appName 项目名
	 * @param fileName 文件名
	 * @param width 图片宽
	 * @param height 图片高度度
	 * @param pixelRatio 分辨率
	 * @param theme echarts主题
	 * @return 图片URL，失败则返回null
	 */
	public String getChartImgUrl(String options, String appName, String fileName, int width, int height, String pixelRatio, String theme) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		params.put("appName", appName);
		params.put("fileName", fileName);
		params.put("height", height);
		params.put("width", width);
		params.put("pixelRatio", pixelRatio);
		params.put("theme", theme);
		return this.getChartImgUrl(params);
	}

	/**
	 * 获取持久化图片URL
	 * @param options 含变量option的js代码
	 * @param appName 项目名
	 * @param fileName 文件名
	 * @param width 图片宽
	 * @param height 图片高度度
	 * @param pixelRatio 分辨率
	 * @return 图片URL，失败则返回null
	 */
	public String getChartImgUrl(String options, String appName, String fileName, int width, int height, String pixelRatio) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		params.put("appName", appName);
		params.put("fileName", fileName);
		params.put("height", height);
		params.put("width", width);
		params.put("pixelRatio", pixelRatio);
		params.put("theme", THEME);
		return this.getChartImgUrl(params);
	}

	/**
	 * 获取持久化图片URL
	 * @param options 含变量option的js代码
	 * @param appName 项目名
	 * @param fileName 文件名
	 * @param width 图片宽
	 * @param height 图片高度度
	 * @return 图片URL，失败则返回null
	 */
	public String getChartImgUrl(String options, String appName, String fileName, int width, int height) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		params.put("appName", appName);
		params.put("fileName", fileName);
		params.put("height", height);
		params.put("width", width);
		params.put("pixelRatio", PIXEL_RATIO);
		params.put("theme", THEME);
		return this.getChartImgUrl(params);
	}

	/**
	 * 获取持久化图片URL
	 * @param options 含变量option的js代码
	 * @param appName 项目名
	 * @param fileName 文件名
	 * @return 图片URL，失败则返回null
	 */
	public String getChartImgUrl(String options, String appName, String fileName) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		params.put("appName", appName);
		params.put("fileName", fileName);
		params.put("height", HEIGHT);
		params.put("width", WIDTH);
		params.put("pixelRatio", PIXEL_RATIO);
		params.put("theme", THEME);
		return this.getChartImgUrl(params);
	}

	/**
	 * 获取持久化图片URL
	 * @param options 含变量option的js代码
	 * @param appName 项目名
	 * @return 图片URL，失败则返回null
	 */
	public String getChartImgUrl(String options, String appName) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		params.put("appName", appName);
		params.put("height", HEIGHT);
		params.put("width", WIDTH);
		params.put("pixelRatio", PIXEL_RATIO);
		params.put("theme", THEME);
		return this.getChartImgUrl(params);
	}

	/**
	 * 获取持久化图片URL
	 * @param options 含变量option的js代码
	 * @param width 图片宽
	 * @param height 图片高度度
	 * @return 图片URL，失败则返回null
	 */
	public String getChartImgUrl(String options, int width, int height) {
		Map<String, Object> params = new HashMap<>();
		if (APP_NAME == null) {
			logger.error("需要配置 echarts.service.appName, 否则图片是临时的" );
		}
		params.put("appName", APP_NAME);
		params.put("options", options);
		params.put("height", height);
		params.put("width", width);
		params.put("pixelRatio", PIXEL_RATIO);
		params.put("theme", THEME);
		return this.getChartImgUrl(params);
	}

	/**
	 * 获取持久化图片URL
	 * @param options 含变量option的js代码
	 * @return 图片URL，失败则返回null
	 */
	public String getChartImgUrl(String options) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		if (APP_NAME == null) {
			logger.error("需要配置 echarts.service.appName, 否则图片是临时的" );
		}
		params.put("appName", APP_NAME);
		params.put("height", HEIGHT);
		params.put("width", WIDTH);
		params.put("pixelRatio", PIXEL_RATIO);
		params.put("theme", THEME);
		return this.getChartImgUrl(params);
	}


	/**
	 * 获取echarts图片的base64
	 * @param params { options: string} 必传， 其他参数查看文档 http://192.168.23.92:3000/doc#tab=img
	 * @return 图片base64，失败则返回null
	 */
	public String getChartImgBase64(Map<String, Object> params) {
		String base64 = null;
		String result = HttpUtil.post(SERVICE_URL + "/api/img", params);
		Map res = JSONUtil.parseObj(result);
		if (!"200".equals(res.get("code").toString())) {
			logger.error("获取图片base64失败！" + JSONUtil.toJsonPrettyStr(res));
		} else {
			base64 = res.get("data").toString();
		}

		return base64;
	}


	/**
	 * 获取图片的base64
	 * @param options 含变量option的js代码
	 * @param width 图片宽
	 * @param height 图片高度度
	 * @param pixelRatio 分辨率
	 * @param theme echarts主题
	 * @return 图片URL，失败则返回null
	 */
	public String getChartImgBase64(String options, int width, int height, String pixelRatio, String theme) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		params.put("height", height);
		params.put("width", width);
		params.put("pixelRatio", pixelRatio);
		params.put("theme", theme);
		return this.getChartImgBase64(params);
	}

	/**
	 * 获取图片的base64
	 * @param options 含变量option的js代码
	 * @param width 图片宽
	 * @param height 图片高度度
	 * @param pixelRatio 分辨率
	 * @return 图片URL，失败则返回null
	 */
	public String getChartImgBase64(String options, int width, int height, String pixelRatio) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		params.put("height", height);
		params.put("width", width);
		params.put("pixelRatio", pixelRatio);
		params.put("theme", THEME);
		return this.getChartImgBase64(params);
	}

	/**
	 * 获取图片的base64
	 * @param options 含变量option的js代码
	 * @param width 图片宽
	 * @param height 图片高度度
	 * @return 图片URL，失败则返回null
	 */
	public String getChartImgBase64(String options, int width, int height) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		params.put("height", height);
		params.put("width", width);
		params.put("pixelRatio", PIXEL_RATIO);
		params.put("theme", THEME);
		return this.getChartImgBase64(params);
	}

	/**
	 * 获取图片的base64
	 * @param options 含变量option的js代码
	 * @return 图片URL，失败则返回null
	 */
	public String getChartImgBase64(String options) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		params.put("height", HEIGHT);
		params.put("width", WIDTH);
		params.put("pixelRatio", PIXEL_RATIO);
		params.put("theme", THEME);
		return this.getChartImgBase64(params);
	}

	/**
	 * 获取echarts图片文件File
	 * @param params <code>options</code> 必传，新增<code>fileName</code>默认时间戳 ，<code>fileDir</code>文件存储目录，相对与Resource
	 * 其他参数查看文档 http://192.168.23.92:3000/doc#tab=img
	 * @return 图片文件 File，失败则返回null
	 */
	public File getChartImgFile(Map<String, Object> params) {
		String base64 = "";
		String result = HttpUtil.post(SERVICE_URL + "/api/img", params);
		Map res = JSONUtil.parseObj(result);
		if (!"200".equals(res.get("code").toString())) {
			logger.error("获取图片base64失败！" + JSONUtil.toJsonPrettyStr(res));
			base64 = null;
		} else {
			base64 = res.get("data").toString();
		}
		String fileDir = params.containsKey("fileDir") ? params.get("fileDir").toString() : FILE_DIR;
		fileDir =  getResourceDir(fileDir);
		String imgType = params.containsKey("imgType") ? params.get("imgType").toString() : "png";
		String fileName = params.containsKey("fileName") ? params.get("fileName").toString() : String.valueOf(System.currentTimeMillis());
		return toImage(base64, fileDir, fileName + "." + imgType);
	}

	/**
	 * 获取echarts图片文件File
	 * @param options 含变量option的js代码
	 * @param fileDir 存储文件目录
	 * @param fileName 存储文件名
	 * @param width 图片宽
	 * @param height 图片高度度
	 * @param pixelRatio 分辨率
	 * @param theme echarts主题
	 * @return 图片 File，失败则返回null
	 */
	public File getChartImgFile(String options, String fileDir, String fileName, int width, int height, String pixelRatio, String theme) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		params.put("fileDir", fileDir);
		params.put("fileName", fileName);
		params.put("height", height);
		params.put("width", width);
		params.put("pixelRatio", pixelRatio);
		params.put("theme", theme);
		return this.getChartImgFile(params);
	}

	/**
	 * 获取echarts图片文件File
	 * @param options 含变量option的js代码
	 * @param fileDir 存储文件目录
	 * @param fileName 存储文件名
	 * @param width 图片宽
	 * @param height 图片高度度
	 * @param pixelRatio 分辨率
	 * @return 图片 File，失败则返回null
	 */
	public File getChartImgFile(String options, String fileDir, String fileName, int width, int height, String pixelRatio) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		params.put("fileDir", fileDir);
		params.put("fileName", fileName);
		params.put("height", height);
		params.put("width", width);
		params.put("pixelRatio", pixelRatio);
		params.put("theme", THEME);
		return this.getChartImgFile(params);
	}

	/**
	 * 获取echarts图片文件File
	 * @param options 含变量option的js代码
	 * @param fileDir 存储文件目录
	 * @param fileName 存储文件名
	 * @param width 图片宽
	 * @param height 图片高度度
	 * @return 图片 File，失败则返回null
	 */
	public File getChartImgFile(String options, String fileDir, String fileName, int width, int height) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		params.put("fileDir", fileDir);
		params.put("fileName", fileName);
		params.put("height", height);
		params.put("width", width);
		params.put("pixelRatio", PIXEL_RATIO);
		params.put("theme", THEME);
		return this.getChartImgFile(params);
	}

	/**
	 * 获取echarts图片文件File
	 * @param options 含变量option的js代码
	 * @param fileDir 存储文件目录
	 * @param fileName 存储文件名
	 * @return 图片 File，失败则返回null
	 */
	public File getChartImgFile(String options, String fileDir, String fileName) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		params.put("fileDir", fileDir);
		params.put("fileName", fileName);
		params.put("height", HEIGHT);
		params.put("width", WIDTH);
		params.put("pixelRatio", PIXEL_RATIO);
		params.put("theme", THEME);
		return this.getChartImgFile(params);
	}

	/**
	 * 获取echarts图片文件File
	 * @param options 含变量option的js代码
	 * @param fileName 存储文件名
	 * @param width 图片宽
	 * @param height 图片高度度
	 * @return 图片 File，失败则返回null
	 */
	public File getChartImgFile(String options, String fileName, int width, int height) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		params.put("fileDir", FILE_DIR);
		params.put("fileName", fileName);
		params.put("height", height);
		params.put("width", width);
		params.put("pixelRatio", PIXEL_RATIO);
		params.put("theme", THEME);
		return this.getChartImgFile(params);
	}

	/**
	 * 获取echarts图片文件File
	 * @param options 含变量option的js代码
	 * @param fileName 存储文件名
	 * @return 图片 File，失败则返回null
	 */
	public File getChartImgFile(String options, String fileName) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		params.put("fileDir", FILE_DIR);
		params.put("fileName", fileName);
		params.put("height", HEIGHT);
		params.put("width", WIDTH);
		params.put("pixelRatio", PIXEL_RATIO);
		params.put("theme", THEME);
		return this.getChartImgFile(params);
	}

	/**
	 * 获取echarts图片文件File
	 * @param options 含变量option的js代码
	 * @return 图片 File，失败则返回null
	 */
	public File getChartImgFile(String options) {
		Map<String, Object> params = new HashMap<>();
		params.put("options", options);
		params.put("fileDir", FILE_DIR);
		params.put("fileName", String.valueOf(System.currentTimeMillis()));
		params.put("height", HEIGHT);
		params.put("width", WIDTH);
		params.put("pixelRatio", PIXEL_RATIO);
		params.put("theme", THEME);
		return this.getChartImgFile(params);
	}


	/**
	 * 保存 imageBase64 到指定文件中。如果<code>fileName</code>含有拓展名，则直接使用<code>fileName</code>的拓展名。
	 * 否则，如果 <code>imageBase64</code> 为Data URLs，则更具前缀的来判断拓展名。如果无法判断拓展名，则使用“png”作为默认拓展名。
	 * @param imageBase64 图片的base64编码字符串
	 * @param dirName 保存图片的目录
	 * @param fileName 图片的名称
	 * @return 如果生成成功，则返回生成的文件路径。否则返回 null
	 */
	private File toImage(String imageBase64, String dirName, String fileName) {
		File dir = FileUtil.file(dirName);
		return toImage(imageBase64, dir, fileName);
	}

	/**
	 * 保存 imageBase64 到指定文件中。如果<code>fileName</code>含有拓展名，则直接使用<code>fileName</code>的拓展名。
	 * 否则，如果 <code>imageBase64</code> 为Data URLs，则更具前缀的来判断拓展名。如果无法判断拓展名，则使用“png”作为默认拓展名。
	 * @param imageBase64 图片的base64编码字符串
	 * @param dir 保存图片的目录
	 * @param fileName 图片的名称
	 * @return 如果生成成功，则返回生成的文件路径。否则返回 null
	 */
	private File toImage(String imageBase64, File dir, String fileName) {
		if (!dir.exists()) {
			FileUtil.mkdir(dir);
		}
		File imagePath = null;
		if(!fileName.contains(".")) {
			String extension = "png";
			imagePath = new File(dir, fileName + "." + extension);
		} else {
			imagePath = new File(dir, fileName);
		}
		return toImage(imageBase64, imagePath);
	}

	/**
	 * 将base64字符串恢复为图片文件
	 *
	 * @param imageBase64
	 *            图片文件的base64字符串
	 * @param imagePath
	 *            恢复的图片文件的保存地址
	 * @return 如果生成成功，则返回生成的文件路径，此时结果为参数的<code>imagePath</code>。。否则返回 null
	 */
	private File toImage(String imageBase64, File imagePath) {
		// base64 字符串中没有 ","
		int firstComma = imageBase64.indexOf(",");
		if(firstComma >= 0) {
			imageBase64 = imageBase64.substring(firstComma + 1);
		}
		return toImage(base64Decode2Bytes(imageBase64), imagePath);
	}

	/**
	 * 将byte数组存为图片文件
	 *
	 * @param imageBytes 图片文件的 byte 数组
	 * @param imagePath 图片文件的保存地址
	 * @return 如果生成成功，则返回生成的文件路径，此时结果为参数的<code>imagePath</code>。否则返回 null
	 */
	private File toImage(byte[] imageBytes, File imagePath) {
		if (!imagePath.getParentFile().exists()) {
			imagePath.getParentFile().mkdirs();
		}
		try (BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(imagePath))) {
			bos.write(imageBytes);
			return imagePath;
		} catch (IOException e) {
			return null;
		}
	}


	private String getResourceDir(String dir) {
		String path = this.getClass().getResource("/").getPath() + dir + "/";
		try {
			// 中文编码
			path = URLDecoder.decode(path, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return path;
	}

	private static byte[] base64Decode2Bytes(String base64) {
		return Base64.getDecoder().decode(base64);
	}
}